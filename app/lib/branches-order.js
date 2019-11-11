// @flow
import { Branch } from './branch';
import { Commit } from './commit';

type Color = string;

export type CompareBranchesOrder = (
  branchNameA: Branch.name,
  branchNameB: Branch.name
) => number;

export class BranchesOrder {
  branches: Set<Branch.name>;

  unorderedBranches: Map<Branch.name, Date>;

  colors: Color[];

  constructor(
    commits: Array<Commit>,
    colors: Color[],
    compareFunction: CompareBranchesOrder | undefined
  ) {
    this.colors = colors;
    this.unorderedBranches = new Map();
    this.branches = new Set();
    commits.forEach(commit => {
      console.log(commit);
      this.unorderedBranches.set(commit.branchToDisplay, commit.date);
    });

    // if (compareFunction) {
    this.unorderedBranches = new Map(
      [...this.unorderedBranches.entries()].sort((a, b) => {
        return a[1] - b[1];
      })
    );
    for (const un of this.unorderedBranches) {
      this.branches.add(un[0]);
    }
  }

  get(branchName: Branch.name): number {
    console.log(this.branches);
    return Array.from(this.branches).findIndex(branch => branch === branchName);
  }

  getColorOf(branchName: Branch.name): Color {
    return this.colors[this.get(branchName) % this.colors.length];
  }
}
