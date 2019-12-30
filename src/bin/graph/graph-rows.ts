import { Commit } from './commit'

export { createGraphRows, RegularGraphRows as GraphRows }

function createGraphRows(commits: Array<Commit>) {
    return new RegularGraphRows(commits)
}

export class RegularGraphRows<TNode> {
    protected rows = new Map<Commit['hash'], number>()

    private maxRowCache: number | undefined = undefined

    public constructor(commits: Array<Commit>) {
        this.computeRowsFromCommits(commits)
    }

    public getRowOf(commitHash: Commit['hash']): number {
        return this.rows.get(commitHash) || 0
    }

    public getMaxRow(): number {
        if (this.maxRowCache === undefined) {
            this.maxRowCache = uniq(Array.from(this.rows.values())).length - 1
        }
        return this.maxRowCache
    }

    protected computeRowsFromCommits(commits: Array<Commit>): void {
        commits.forEach((commit, i) => {
            this.rows.set(commit.hash, i)
        })
        this.maxRowCache = undefined
    }
}

/**
 * Creates a duplicate-free version of an array.
 *
 * Don't use lodash's `uniq` as it increased bundlesize a lot for such a
 * simple function.
 * => The way we bundle for browser seems not to work with `lodash-es`.
 * => I didn't to get tree-shaking to work with `lodash` (the CommonJS version).
 *
 * @param array Array of values
 */
function uniq<T>(array: T[]): T[] {
    const set = new Set<T>()
    array.forEach(value => set.add(value))
    return Array.from(set)
}