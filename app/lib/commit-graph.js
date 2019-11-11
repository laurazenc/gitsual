// @flow
import IntervalTree from 'node-interval-tree';
import * as FastPriorityQueue from 'fastpriorityqueue';
import { RepoWrapper } from './repo';

const BRANCH_COLORS = [
  'dodgerblue',
  'DarkCyan',
  'DarkGoldenRod',
  'DarkGrey',
  'DarkGreen',
  'DarkKhaki',
  'DarkMagenta',
  'DarkOliveGreen',
  'DarkOrange',
  'DarkOrchid',
  'DarkRed',
  'DarkSalmon',
  'DarkSeaGreen',
  'DarkSlateBlue',
  'DarkSlateGrey',
  'DarkTurquoise',
  'DarkViolet'
];

export function getBranchColor(j: number) {
  return BRANCH_COLORS[j % BRANCH_COLORS.length];
}

export const NodeType = {
  Commit: 'Commit',
  Stash: 'Stash'
};

export const EdgeType = {
  Normal: 'Normal',
  Merge: 'Merge'
};

export type Node = [number, number, NodeType];
export type Edge = [[number, number], [number, number], EdgeType];

export class CommitGraph {
  positions: Map<string, Node>;

  width: number;

  edges: IntervalTree<Edge>;

  constructor() {
    this.positions = new Map();
    this.width = 0;
    this.edges = new IntervalTree();
  }

  computePositions(repo: RepoWrapper) {
    function insertCommit(commitSha: string, j: number, forbiddenIndices: Set) {
      // Try to insert as close as possible to i
      // replace i by j
      let dj = 1;
      while (j - dj >= 0 || j + dj < branches.length) {
        if (
          j + dj < branches.length &&
          branches[j + dj] === null &&
          !forbiddenIndices.has(j + dj)
        ) {
          branches[j + dj] = commitSha;
          return j + dj;
        }
        if (
          j - dj >= 0 &&
          branches[j - dj] === null &&
          !forbiddenIndices.has(j - dj)
        ) {
          branches[j - dj] = commitSha;
          return j - dj;
        }
        ++dj;
      }
      // If it is not possible to find an available position, append
      branches.push(commitSha);
      return branches.length - 1;
    }

    this.positions.clear();
    const headSha = repo.headCommit ? repo.headCommit.sha() : null;
    let i = 1;
    const branches: (string | null)[] = ['index'];
    const activeNodes = new Map();
    const activeNodesQueue = new FastPriorityQueue<[number, string]>(
      (lhs, rhs) => lhs[0] < rhs[0]
    );
    activeNodes.set('index', new Set());
    if (headSha) {
      activeNodesQueue.add([repo.shaToIndex.get(headSha), 'index']);
    }
    for (const commit of repo.commits) {
      let j = -1;
      const commitSha = commit.sha();
      const children = repo.children.get(commit.sha()) || [];
      const branchChildren = children.filter(
        childSha => repo.parents.get(childSha)[0] === commitSha
      );
      const mergeChildren = children.filter(
        childSha => repo.parents.get(childSha)[0] !== commitSha
      );
      // Compute forbidden indices
      let highestChild: string | undefined;
      let iMin = Infinity;
      for (const childSha of mergeChildren) {
        const iChild = this.positions.get(childSha)
          ? this.positions.get(childSha)[0]
          : 0;
        if (iChild < iMin) {
          iMin = i;
          highestChild = childSha;
        }
      }
      const forbiddenIndices = highestChild
        ? activeNodes.get(highestChild)
        : new Set();
      // Find a commit to replace
      let commitToReplace: string | null = null;
      let jCommitToReplace = Infinity;
      if (commitSha === headSha) {
        commitToReplace = 'index';
        jCommitToReplace = 0;
      } else {
        // The commit can only replace a child whose first parent is this commit
        for (const childSha of branchChildren) {
          const jChild = this.positions.get(childSha)
            ? this.positions.get(childSha)[1]
            : 0;
          if (!forbiddenIndices.has(jChild) && jChild < jCommitToReplace) {
            commitToReplace = childSha;
            jCommitToReplace = jChild;
          }
        }
      }
      // Insert the commit in the active branches
      if (commitToReplace) {
        j = jCommitToReplace;
        branches[j] = commitSha;
      } else if (children.length > 0) {
        const childSha = children[0];
        const jChild = this.positions.get(childSha)
          ? this.positions.get(childSha)[1]
          : 0;
        // Try to insert near a child
        // We could try to insert near any child instead of arbitrarily chosing the first one
        j = insertCommit(commitSha, jChild, forbiddenIndices);
      } else {
        // TODO: Find a better value for j
        j = insertCommit(commitSha, 0, new Set());
      }
      // Remove useless active nodes
      while (!activeNodesQueue.isEmpty() && activeNodesQueue.peek()[0] < i) {
        const sha = activeNodesQueue.poll()[1];
        activeNodes.delete(sha);
      }
      // Upddate the active nodes
      const jToAdd = [
        j,
        ...branchChildren.map(childSha => this.positions.get(childSha)[1])
      ];
      for (const activeNode of activeNodes.values()) {
        jToAdd.forEach(j => activeNode.add(j));
      }
      activeNodes.set(commitSha, new Set());
      const iRemove = Math.max(
        ...repo.parents
          .get(commitSha)
          .map(parentSha => repo.shaToIndex.get(parentSha))
      );
      activeNodesQueue.add([iRemove, commitSha]);
      // Remove children from active branches
      for (const childSha of branchChildren) {
        if (childSha != commitToReplace) {
          branches[this.positions.get(childSha)[1]] = null;
        }
      }
      // If the commit has no parent, remove it from active branches
      if (repo.parents.get(commitSha).length === 0) {
        branches[j] = null;
      }
      // Finally set the position
      this.positions.set(commitSha, [
        i,
        j,
        repo.stashes.has(commitSha) ? NodeType.Stash : NodeType.Commit
      ]);
      ++i;
    }
    this.width = branches.length;
    this.updateIntervalTree(repo);
  }

  updateIntervalTree(repo: RepoWrapper) {
    this.edges = new IntervalTree();
    for (const [commitSha, [i0, j0]] of this.positions) {
      const parents = repo.parents.get(commitSha);
      for (const [i, parentSha] of parents.entries()) {
        const [i1, j1] = this.positions.get(parentSha);
        this.edges.insert(i0, i1, [
          [i0, j0],
          [i1, j1],
          i > 0 ? EdgeType.Merge : EdgeType.Normal
        ]);
      }
    }
  }
}
