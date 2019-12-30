import Git from 'nodegit'
import { GraphBuilder } from './GraphBuilder'
import { Theme } from './ThemeManager'

const findSimilarOptions = {
    flags: Git.Diff.FIND.RENAMES | Git.Diff.FIND.COPIES | Git.Diff.FIND.FOR_UNTRACKED,
}

const diffOptions = {
    flags: Git.Diff.OPTION.INCLUDE_UNTRACKED | Git.Diff.OPTION.RECURSE_UNTRACKED_DIRS,
}

export interface Repository {
    repo: Git.Repository
    theme: Theme
    name: string
    path: string
    commits: Git.Commit[] | []
    references: Map<string, Git.Reference>
    stashes: Map<string, Stash>
    shaToCommit: Map<string, Git.Commit>
    tags: Map<string, Git.Tag>
    shaToReferences: Map<string, string[]>
    children: Map<string, string[]>
    parents: Map<string, string[]>
    shaToIndex: Map<string, number>
    head: Git.Reference | null
    headCommit: Git.Commit | null
    unstagedPatches: Git.ConvenientPatch[]
    stagedPatches: Git.ConvenientPatch[]
    graph: GraphBuilder
    currentBranch: Git.Reference
}

export class Stash {
    index: number
    commit: Git.Commit

    constructor(index: number, commit: Git.Commit) {
        this.index = index
        this.commit = commit
    }
}

class RepoBuilder {
    repo: Git.Repository
    name: string
    path: string
    commits: Git.Commit[]
    references: Map<string, Git.Reference>
    stashes: Map<string, Stash>
    shaToCommit: Map<string, Git.Commit>
    tags: Map<string, Git.Tag>
    shaToReferences: Map<string, string[]>
    children: Map<string, string[]>
    parents: Map<string, string[]>
    shaToIndex: Map<string, number>
    head: Git.Reference | null
    headCommit: Git.Commit | null
    unstagedPatches: Git.ConvenientPatch[]
    stagedPatches: Git.ConvenientPatch[]
    graph: GraphBuilder | null
    currentBranch: Git.Reference | null
    theme: Theme

    constructor(repo: Git.Repository, name: string, theme: Theme) {
        this.repo = repo
        this.name = name
        this.path = repo.path()
        this.commits = []
        this.references = new Map<string, Git.Reference>()
        this.stashes = new Map<string, Stash>()
        this.shaToCommit = new Map<string, Git.Commit>()
        this.tags = new Map<string, Git.Tag>()
        this.shaToReferences = new Map<string, string[]>()
        this.children = new Map<string, string[]>()
        this.parents = new Map<string, string[]>()
        this.shaToIndex = new Map<string, number>()
        this.head = null
        this.headCommit = null
        this.unstagedPatches = []
        this.stagedPatches = []
        this.graph = null
        this.currentBranch = null
        this.theme = theme
    }

    static async create(repo: Git.Repository, name: string, theme: Theme) {
        const o = new RepoBuilder(repo, name, theme)
        await o.init()
        return o
    }

    async init() {
        await this.getCommits()
        await this.getHead()
        await this.getIndex()
        await this.getGraph()
    }

    async getCommits() {
        const references = await this.prepareReferences()
        const stashes = await this.prepareStashes()
        const newCommits = await this.getNewCommits(references, stashes)
        await this.prepareTags()
        this.updateShaToReferences()
        await this.getParents(newCommits)
        this.removeUnreachableCommits()
        await this.hideStashSecondParents(stashes)
        await this.sortCommits()
    }

    async getIndex() {
        this.stagedPatches = await this.getStagedPatches()
        this.unstagedPatches = await this.getUnstagedPatches()
    }

    async getGraph() {
        this.graph = await GraphBuilder.create(this)
    }

    // References

    async prepareReferences() {
        try {
            const references = await this.getReferences()
            const referencesToUpdate: string[] = []
            const newReferences = new Map<string, Git.Reference>()
            for (const reference of references) {
                const name = reference.name()
                const commitSha = reference.target().tostrS()
                if (
                    !this.references.has(name) ||
                    this.references
                        .get(name)!
                        .target()
                        .tostrS() !== commitSha
                ) {
                    referencesToUpdate.push(name)
                }
                newReferences.set(name, reference)
            }
            this.references = newReferences
            return referencesToUpdate
        } catch (e) {
            throw new Error(e)
        }
    }

    async getReferences() {
        try {
            const references = await this.repo.getReferences()
            return references.filter((reference: Git.Reference) => reference.name() !== 'refs/stash')
        } catch (e) {
            throw new Error(e)
        }
    }

    updateShaToReferences() {
        this.shaToReferences.clear()
        for (const [name, reference] of this.references) {
            const commitSha = this.tags.has(name)
                ? this.tags
                      .get(name)!
                      .targetId()
                      .tostrS()
                : reference.target().tostrS()
            if (!this.shaToReferences.has(commitSha)) {
                this.shaToReferences.set(commitSha, [])
            }
            this.shaToReferences.get(commitSha)!.push(name)
        }
    }

    getReferenceCommits() {
        return Array.from(this.references.entries(), ([name, reference]) => this.getReferenceCommit(name, reference))
    }

    getReferenceCommit(name: string, reference: Git.Reference) {
        if (this.tags.has(name)) {
            return this.shaToCommit.get(
                this.tags
                    .get(name)!
                    .targetId()
                    .tostrS(),
            )!
        } else {
            return this.shaToCommit.get(reference.target().tostrS())!
        }
    }

    // Stashes

    async prepareStashes() {
        const stashes = await this.getStashes()
        const stashesToUpdate: Stash[] = []
        for (const [sha, stash] of stashes) {
            if (!this.stashes.has(sha)) {
                stashesToUpdate.push(stash)
            }
        }
        this.stashes = stashes
        return stashesToUpdate
    }

    async getStashes() {
        const oids: Git.Oid[] = []
        await Git.Stash.foreach(this.repo, (index: Git.Index, message: string, oid: Git.Oid) => {
            oids.push(oid)
        })
        const commits = await Promise.all(oids.map(oid => this.repo.getCommit(oid)))
        return new Map<string, Stash>(
            commits.map((commit, index) => [commit.sha(), new Stash(index, commit)] as [string, Stash]),
        )
    }

    // Commits

    async getNewCommits(references: string[], stashes: Stash[]) {
        const walker = Git.Revwalk.create(this.repo)
        for (const name of references) {
            walker.pushRef(name)
        }
        for (const stash of stashes) {
            walker.push(stash.commit.id())
        }
        for (const commit of this.commits) {
            walker.hide(commit.id())
        }
        // Retrieve new commits
        const newCommits = await walker.getCommitsUntil(() => true)
        for (const commit of newCommits) {
            this.commits.push(commit)
            this.shaToCommit.set(commit.sha(), commit)
        }
        return newCommits
    }

    getParents(commits: Git.Commit[]) {
        for (const commit of commits) {
            this.children.set(commit.sha(), [])
        }
        for (const commit of commits) {
            const commitSha = commit.sha()
            const parentShas = commit.parents().map(oid => oid.tostrS())
            this.parents.set(commitSha, parentShas)
            // Update children
            for (const parentSha of parentShas) {
                this.children.get(parentSha)!.push(commitSha)
            }
        }
    }

    removeUnreachableCommits() {
        //Find unreachable commits by doing a DFS
        const alreadyAdded = new Map<string, boolean>()
        const frontier: Git.Commit[] = [
            ...this.getReferenceCommits(),
            ...Array.from(this.stashes.values(), (stash: Stash) => stash.commit),
        ]
        for (const commit of frontier) {
            alreadyAdded.set(commit.sha(), true)
        }
        while (frontier.length > 0) {
            const commit = frontier.pop()!
            const commitSha = commit.sha()
            for (const parentSha of this.parents.get(commitSha)!) {
                if (!alreadyAdded.get(parentSha)) {
                    alreadyAdded.set(parentSha, true)
                    frontier.push(this.shaToCommit.get(parentSha)!)
                }
            }
        }
        const commitsToRemove: Git.Commit[] = []
        for (const commit of this.commits) {
            if (!alreadyAdded.has(commit.sha())) {
                commitsToRemove.push(commit)
            }
        }
        // Remove them
        for (const commit of commitsToRemove) {
            this.removeCommit(commit)
        }
    }

    removeCommit(commit: Git.Commit) {
        const commitSha = commit.sha()
        this.commits.splice(this.commits.indexOf(this.shaToCommit.get(commitSha)!), 1) // TODO: batch removal or update shaToIndex before removal
        this.shaToCommit.delete(commitSha)
        for (const parentSha of this.parents.get(commitSha)!) {
            const parentChildren = this.children.get(parentSha)!
            parentChildren.splice(parentChildren.indexOf(commitSha), 1)
        }
        this.parents.delete(commitSha)
        for (const childSha of this.children.get(commitSha)!) {
            const childParents = this.parents.get(childSha)!
            childParents.splice(childParents.indexOf(commitSha), 1)
        }
        this.children.delete(commitSha)
    }

    sortCommits() {
        const dfs = (commit: Git.Commit) => {
            const commitSha = commit.sha()
            if (alreadySeen.get(commitSha)) {
                return
            }
            alreadySeen.set(commitSha, true)
            for (const childSha of this.children.get(commitSha)!) {
                dfs(this.shaToCommit.get(childSha)!)
            }
            sortedCommits.push(commit)
        }

        //Sort the commits by date (from newer to older)
        const commitsWithTime = this.commits.map(commit => [commit.date().valueOf(), commit] as [number, Git.Commit])
        commitsWithTime.sort((lhs, rhs) => rhs[0] - lhs[0])
        this.commits = commitsWithTime.map(([time, commit]) => commit)
        //Topological sort (from parent to children)
        const sortedCommits: Git.Commit[] = []
        const alreadySeen = new Map<string, boolean>()
        for (const commit of this.commits) {
            dfs(commit)
        }
        this.commits = sortedCommits
        //Update shaToIndex
        this.shaToIndex = new Map(this.commits.map((commit, i) => [commit.sha(), i] as [string, number]))
    }

    async getHead() {
        try {
            this.head = await this.repo.head()
        } catch (e) {
            this.head = null
        }
        this.headCommit = await this.repo.getHeadCommit()
        this.currentBranch = await this.repo.getCurrentBranch()
    }

    // Tags

    async prepareTags() {
        this.tags = new Map(
            await Promise.all(
                [...this.references.values()]
                    .filter(reference => reference.isTag() && !this.shaToCommit.has(reference.target().tostrS()))
                    .map(
                        async reference =>
                            [reference.name(), await this.repo.getTag(reference.target())] as [string, Git.Tag],
                    ),
            ),
        )
    }

    async hideStashSecondParents(stashes: Stash[]) {
        const parents = await Promise.all(Array.from(stashes.values(), stash => stash.commit.parent(1)))
        parents.map(parent => this.removeCommit(parent))
    }

    // Stages

    async getUnstagedPatches() {
        const unstagedDiff = await Git.Diff.indexToWorkdir(this.repo, undefined, diffOptions)
        await unstagedDiff.findSimilar(findSimilarOptions)
        return await unstagedDiff.patches()
    }

    async getStagedPatches() {
        const headCommit = await this.repo.getHeadCommit() // Retrieve the head
        const oldTree = headCommit ? await headCommit.getTree() : undefined
        const stagedDiff = await Git.Diff.treeToIndex(this.repo, oldTree, undefined, diffOptions)
        await stagedDiff.findSimilar(findSimilarOptions)
        return await stagedDiff.patches()
    }
}

export default RepoBuilder
