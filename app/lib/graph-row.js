// @flow

import { Commit } from './commit';

const uniq = array => {
  const set = new Set();
  array.forEach(value => set.add(value));
  return Array.from(set);
};

export class GraphRows {
  rows: Map<Commit.hash, number>;

  maxRowCache: number | undefined;

  constructor(commits: Array<Commit>) {
    this.rows = new Map<Commit.hash, number>();
    this.computeRowsFromCommits(commits);
    this.getRowOf = this.getRowOf;
    this.getMaxRow = this.getMaxRow;
    this.maxRowCache = undefined;
  }

  computeRowsFromCommits(commits: Array<Commit>): void {
    commits.forEach((commit, i) => {
      this.rows.set(commit.hash, i);
    });
  }

  getRowOf(commitHash: Commit.hash): number {
    return this.rows.get(commitHash) || 0;
  }

  getMaxRow(): number {
    if (this.maxRowCache === undefined) {
      this.maxRowCache = uniq(Array.from(this.rows.values())).length - 1;
    }
    return this.maxRowCache;
  }
}

export const createGraphRows = (commits: Array<Commit<TNode>>) => {
  return new GraphRows(commits);
};
