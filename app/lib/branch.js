// @flow
import { Commit } from './commit';

interface BranchOptions {
  name: string;
  parentCommitHash?: Commit.hash;
}

export const DELETED_BRANCH_NAME = '';

export class Branch {
  name: BranchOptions.name;

  parentCommitHash: BranchOptions.parentCommitHash;

  constructor(options: BranchOptions) {
    this.name = options.name;
    this.parentCommitHash = options.parentCommitHash;
    this.isDeleted = this.isDeleted;
  }

  /**
   * Return true if branch was deleted.
   */
  isDeleted(): boolean {
    return this.name === DELETED_BRANCH_NAME;
  }
}

export const createDeletedBranch = (
  gitgraph: GitgraphCore<TNode>,
  onGraphUpdate: () => void
): Branch => {
  return new Branch({
    name: DELETED_BRANCH_NAME,
    gitgraph,
    onGraphUpdate
  });
};
