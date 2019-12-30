import { Commit } from './commit'
import { GraphBuilder } from '../GraphBuilder'

interface BranchOptions {
    name: string
    color: string
    gitgraph: GraphBuilder<TNode>
    parentCommitHash?: Commit['hash']
    onGraphUpdate: () => void
}

export const DELETED_BRANCH_NAME = ''

export class Branch {
    name: BranchOptions['name']
    private gitgraph: GraphBuilder<TNode>
    color: string

    parentCommitHash: BranchOptions['parentCommitHash']
    private onGraphUpdate: () => void

    constructor(options: BranchOptions) {
        this.name = options.name
        this.gitgraph = options.gitgraph
        this.onGraphUpdate = options.onGraphUpdate
        this.color = options.color
        this.parentCommitHash = options.parentCommitHash
    }

    /**
     * Return true if branch was deleted.
     */
    public isDeleted(): boolean {
        return this.name === DELETED_BRANCH_NAME
    }
}

export const createDeletedBranch = (gitgraph: GraphBuilder<TNode>, onGraphUpdate: () => void): Branch => {
    return new Branch({
        name: DELETED_BRANCH_NAME,
        gitgraph,
        onGraphUpdate,
    })
}
