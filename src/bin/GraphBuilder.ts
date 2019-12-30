import Git from 'nodegit'

import RepoBuilder from './RepoBuilder'
import { Commit, CommitType } from './graph/commit'
import { Refs } from './graph/refs'

import { CommitGraph } from './graph/commit-graph'
import { createGraphRows, GraphRows } from './graph/graph-rows'

import { Branch, DELETED_BRANCH_NAME } from './graph/branch'

import { BranchesOrder, CompareBranchesOrder } from './graph/branches-order'

import { Theme } from './ThemeManager'

export enum Orientation {
    VerticalReverse = 'vertical-reverse',
    Horizontal = 'horizontal',
    HorizontalReverse = 'horizontal-reverse',
}

interface Coordinate {
    x: number
    y: number
}

interface RenderedData<TNode> {
    commits: Array<Commit>
    commitMessagesX: number
}

type InternalBranchesPaths = Map<Branch, InternalCoordinate[]>

interface InternalCoordinate extends Coordinate {
    mergeCommit?: boolean
}

export class GraphBuilder {
    theme: Theme
    repo: RepoBuilder
    commits: Array<Commit> = []
    edges: Map<Commit['hash'], Coordinate[][]>

    graph: CommitGraph

    branches: Map<Branch['name'], Branch>

    branchesPaths?: InternalBranchesPaths

    currentBranch?: Branch | null

    branchesOrderFunction?: CompareBranchesOrder

    initCommitOffsetX: number

    initCommitOffsetY: number

    commitMessagesX: number

    graphDeep?: number

    isVertical: boolean

    isReverse: boolean

    orientation: Orientation

    public refs = new Refs()
    public tags = new Refs()

    private listeners: Array<(data: RenderedData<TNode>) => void> = []

    private nextTimeoutId: number | null = null

    constructor(repo: RepoBuilder) {
        this.repo = repo
        this.graph = new CommitGraph()
        this.branches = new Map<string, Branch>()
        this.edges = new Map()
        this.branchesPaths = new Map()
        this.initCommitOffsetX = 0
        this.initCommitOffsetY = 0
        this.commitMessagesX = 0
        this.graphDeep = 0
        this.currentBranch = null
        this.isVertical = true
        this.isReverse = true
        this.orientation = Orientation.VerticalReverse
        this.theme = repo.theme
    }

    static async create(repo: RepoBuilder) {
        const o = new GraphBuilder(repo)
        const renderData = await o.computePositions()
        return renderData
    }

    public async computePositions() {
        this.commits = await this.computeRenderedCommits()

        await this.updateGraph()

        return { commits: this.commits, commitgraph: this.graph }
    }

    /**
     * Return the default color for given branch.
     *
     * @param branchesOrder Computed order of branches
     * @param branchName Name of the branch
     */
    private getBranchDefaultColor(branchesOrder: BranchesOrder<TNode>, branchName: Branch['name']): string {
        return branchesOrder.getColorOf(branchName)
    }

    withBranches(branches: Map<Commit['hash'], Set<Branch['name']>>, commit: Commit<TNode>): Commit<TNode> {
        let commitBranches = Array.from((branches.get(commit.hash) || new Set()).values())

        if (commitBranches.length === 0) {
            // No branch => branch has been deleted.
            commitBranches = [DELETED_BRANCH_NAME]
        }

        return commit.setBranches(commitBranches)
    }

    async computeRenderedCommits() {
        for (const commit of this.repo.commits) {
            const isStash = this.repo.stashes.has(commit.sha())
            const graphCommit = new Commit({
                author: {
                    name: commit.author().name(),
                    email: commit.author().email(),
                },
                committer: {
                    name: commit.committer().name(),
                    email: commit.committer().email(),
                },
                subject: commit.summary(),
                body: commit.body(),
                hash: commit.sha(),
                date: commit.date(),
                parents: commit.parents(),
                type: isStash ? CommitType.Stash : commit.parents().length > 1 ? CommitType.Merge : CommitType.Commit,
            })

            this.commits.push(graphCommit)
        }

        const branches = this.getBranches()

        for (const reference of this.repo.references) {
            const [name, ref] = reference
            const branch = new Branch({
                name,
                gitgraph: this,
                parentCommitHash: this.repo.parents.get(ref.target().tostrS())[0] as string,
                onGraphUpdate: () => this.next(),
                color: this.theme.getRandomColor,
            })
            this.branches.set(name, branch)
        }

        const commitsWithBranches = this.commits.map(commit => this.withBranches(branches, commit))

        const rows = createGraphRows(this.commits)

        const branchesOrder = new BranchesOrder<TNode>(
            commitsWithBranches,
            this.theme.colors,
            this.branchesOrderFunction,
        )

        console.log('branchesOrder', branchesOrder)

        return (
            commitsWithBranches
                .map(commit => commit.setRefs(this.refs))
                .map(commit => this.withPosition(rows, branchesOrder, commit))
                //Fallback commit computed color on branch color.
                .map(commit =>
                    commit.withDefaultColor(this.getBranchDefaultColor(branchesOrder, commit.branchToDisplay)),
                )
        )
    }

    async updateGraph() {
        this.graph.computePositions(this.repo)
    }

    getBranches(): Map<Commit['hash'], Set<Branch['name']>> {
        const result = new Map<Commit['hash'], Set<Branch['name']>>()

        const queue: Array<Commit['hash']> = []
        const branches = []

        for (const ref of this.repo.references) {
            const [branch] = ref
            if (branch !== this.repo.head.name()) branches.push(ref)
        }

        branches.forEach(branch => {
            const [branchName, ref] = branch
            const commitHash = ref.target().tostrS()
            if (commitHash) {
                queue.push(commitHash)
            }

            while (queue.length > 0) {
                const currentHash = queue.pop() as Commit['hash']
                const current = this.commits.find(({ hash }) => hash === currentHash) as Commit<TNode>
                const prevBranches = result.get(currentHash) || new Set<Branch['name']>()
                prevBranches.add(branchName)
                result.set(currentHash, prevBranches)
                if (current.parents.length > 0) {
                    queue.push(current.parents[0])
                }
            }
        })

        return result
    }

    // getCommitBranches(commitSha: string) {
    //     const branches: Array<string> = []
    //     for (const [branch, ref] of this.repo.references) {
    //         if (ref.target().tostrS() === commitSha) {
    //             branches.push(branch)
    //         }
    //     }
    //     return branches
    // }

    // computeRenderedBranchesPaths(commits: Array<Commit<TNode>>): BranchesPaths<TNode> {
    //     return new BranchesPathsCalculator<TNode>(
    //         commits,
    //         this.branches,
    //         50, // this.theme.commit.spacing,
    //         this.isVertical,
    //         this.isReverse,
    //         () => createDeletedBranch(this, () => this.next()),
    //     ).execute()
    // }

    // public getBranch(branchName: string): Branch {
    //     return this.branches.get(branchName) || null
    // }

    // /**
    //  * Tell each listener something new happened.
    //  * E.g. a rendering library will know it needs to re-render the graph.
    //  */
    private next() {
        if (this.nextTimeoutId) {
            window.clearTimeout(this.nextTimeoutId)
        }

        // Use setTimeout() with `0` to debounce call to next tick.
        this.nextTimeoutId = window.setTimeout(() => {
            this.listeners.forEach(listener => listener(this.computePositions()))
        }, 0)
    }

    private withPosition(
        rows: GraphRows<TNode>,
        branchesOrder: BranchesOrder<TNode>,
        commit: Commit<TNode>,
    ): Commit<TNode> {
        const row = rows.getRowOf(commit.hash)
        const maxRow = rows.getMaxRow()

        const order = branchesOrder.get(commit.branchToDisplay)

        switch (this.orientation) {
            default:
                return commit.setPosition({
                    x: this.initCommitOffsetX + this.theme.branch.spacing * order,
                    y: this.initCommitOffsetY + this.theme.commit.spacing * (maxRow - row),
                })

            case Orientation.VerticalReverse:
                return commit.setPosition({
                    x: this.initCommitOffsetX + this.theme.branch.spacing * order,
                    y: this.initCommitOffsetY + this.theme.commit.spacing * row,
                })

            case Orientation.Horizontal:
                return commit.setPosition({
                    x: this.initCommitOffsetX + this.theme.commit.spacing * row,
                    y: this.initCommitOffsetY + this.theme.branch.spacing * order,
                })

            case Orientation.HorizontalReverse:
                return commit.setPosition({
                    x: this.initCommitOffsetX + this.theme.commit.spacing * (maxRow - row),
                    y: this.initCommitOffsetY + this.theme.branch.spacing * order,
                })
        }
    }
}
