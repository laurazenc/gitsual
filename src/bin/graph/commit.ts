import { Branch } from './branch'
import { Refs } from './refs'

export enum CommitType {
    Commit = 'commit',
    Stash = 'stash',
    Merge = 'merge',
}

interface CommitRenderOptions<TNode> {
    renderDot?: (commit: Commit) => TNode
    renderMessage?: (commit: Commit) => TNode
    renderTooltip?: (commit: Commit) => TNode
}

interface CommitOptions<TNode> extends CommitRenderOptions<TNode> {
    author: Committer
    subject: string
    body?: string
    hash: string
    parents?: any[]
    dotText?: string
    committer: Committer
    date: Date
    type: CommitType
}

interface Committer {
    name: string
    email: string
    timestamp?: number
}

export class Commit {
    public x = 0

    public y = 0

    public hash: string

    public hashAbbrev: string

    public parents: Array<Commit['hash']>

    public parentsAbbrev: Array<Commit['hashAbbrev']>
    date: CommitOptions<TNode>['date']

    author: Committer
    type: CommitType

    committer: Committer

    subject: string

    body: string

    refs: string[] = []
    tags: string[] = []

    get message() {
        let message = ''

        message += this.subject
        message += ` - ${this.author.name} <${this.author.email}>`

        return message
    }

    dotText: string | undefined

    public branches?: Array<Branch['name']>

    public get branchToDisplay(): Branch['name'] {
        return this.branches ? this.branches[0] : ''
    }

    //tags: Tag[] = []

    constructor(options: CommitOptions<TNode>) {
        this.author = options.author
        this.committer = options.committer

        // Set commit message
        this.subject = options.subject
        this.body = options.body || ''

        // Set commit hash
        this.hash = options.hash
        this.hashAbbrev = this.hash.substring(0, 7)
        this.date = options.date

        // Set parent hash
        this.parents = options.parents ? options.parents.map(parent => (parent.tostrS ? parent.tostrS() : parent)) : []
        this.parentsAbbrev = this.parents.map(commit => commit.substring(0, 7))

        this.dotText = options.dotText

        this.type = options.type
    }

    public isBranch(): boolean {
        return this.branches.length > 0
    }

    public setTags(
        tags: Refs,
        getTagStyle: (name: Tag<TNode>['name']) => Partial<TagStyle>,
        getTagRender: (name: Tag<TNode>['name']) => GitgraphTagOptions<TNode>['render'],
    ): this {
        this.tags = tags
            .getNames(this.hash)
            .map(name => new Tag(name, getTagStyle(name), getTagRender(name), this.style))
        return this
    }

    public isMerged(): boolean {
        return !this.isBranch() && this.parents.length > 1
    }

    public withDefaultColor(color: string): Commit<TNode> {
        const commit = this.cloneCommit()

        return commit
    }

    public setPosition({ x, y }: { x: number; y: number }): this {
        this.x = x
        this.y = y
        return this
    }

    public setBranches(branches: Array<Branch['name']>): this {
        this.branches = branches
        return this
    }

    public setRefs(refs: Refs): this {
        this.refs = refs.getNames(this.hash)
        return this
    }

    private cloneCommit() {
        const commit = new Commit({
            author: this.author,
            committer: this.committer,
            subject: this.subject,
            body: this.body,
            hash: this.hash,
            parents: this.parents,
            date: this.date,
            type: this.type,
        })

        commit.refs = this.refs
        commit.branches = this.branches
        commit.x = this.x
        commit.y = this.y

        return commit
    }
}
