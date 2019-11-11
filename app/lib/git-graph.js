// @flow
import * as Git from 'nodegit';
import { couldStartTrivia } from 'typescript';
import { RepoBuilder } from './repo';
import { Commit } from './commit';
import { Refs } from './refs';
import { Branch, DELETED_BRANCH_NAME, createDeletedBranch } from './branch';
import { BranchesPathsCalculator } from './branch-path';
import { createGraphRows } from './graph-row';
import { CommitGraph } from './commit-graph';
import { BranchesOrder, CompareBranchesOrder } from './branches-order';

interface Coordinate {
  x: number;
  y: number
}

interface Row {
  id?: number;
  coordinates?: Coordinate;
  message: string;
  isMerge: boolean;
}

type InternalBranchesPaths = Map<Branch, InternalCoordinate[]>;

interface InternalCoordinate extends Coordinate {
  mergeCommit?: boolean;
}

export class GitGraph {
  repo: RepoBuilder;

  graph: CommitGraph;

  commits: Array<Commit> = [];

  edges: Map<Commit.hash, Coordinate[][]>;

  branches: Map<Branch.name, Branch>;

  branchesPaths: InternalBranchesPaths;

  currentBranch: Branch;

  branchesOrderFunction: CompareBranchesOrder;

  initCommitOffsetX: number;

  initCommitOffsetY: number;

  commitMessagesX: number;

  graphDeep: number;

  constructor(repo: RepoBuilder) {
    this.repo = repo;
    this.graph = new CommitGraph();
    this.branches = new Map<string, Branch>();
    this.edges = new Map();
    this.branchesPaths = new Map();
    this.initCommitOffsetX = 0;
    this.initCommitOffsetY = 0;
    this.commitMessagesX = 0;
    this.graphDeep = 0;
    this.computePositions = this.computePositions;
  }

  static async create(repo: Git.Repository) {
    const o = new GitGraph(repo);
    const renderData = await o.computePositions();
    return renderData;
  }

  async computePositions() {
    await this.computeRenderedCommits();
    await this.updateGraph();
    await this.updateCommitPositions();
    await this.updateEdges();
    const commitMessagesX = this.computeCommitMessagesX();
    return { commits: this.commits, commitMessagesX, edges: this.edges };
  }

  async updateGraph() {
    this.graph.computePositions(this.repo);
  }

  async updateEdges() {
    this.commits.map((commit, i) => {
      const position = this.graph.positions.get(commit.hash);
      const path: Coordinate[] = [];

      path.push({ x: position[1] * 15, y: position[0] * 15 });
      if (i + 1 < this.commits.length) {
        const key = Array.from(this.commits.keys())[i + 1];
        console.log('key', key);
        let nextPosition = null;
        nextPosition = this.graph.positions.get(key);
        path.push({ x: nextPosition[1] * 15, y: nextPosition[0] * 15 });
      }

      this.edges.set(commit.hash, path);
    });
  }

  async computeRenderedCommits(): Array<Commit> {
    for (const commit of this.repo.commits) {
      const graphCommit = new Commit({
        author: {
          name: commit.author().name(),
          email: commit.author().email()
        },
        commiter: {
          name: commit.committer().name(),
          email: commit.committer().email()
        },
        subject: commit.summary(),
        body: commit.body(),
        hash: commit.sha(),
        date: commit.date(),
        parents: commit.parents()
      });
      graphCommit.branches = this.getCommitBranches(commit.sha());
      this.commits.push(graphCommit);
    }
  }

  getCommit(commitSha) {
    const [commit] = this.commits.filter(commit => commit.hash === commitSha);
    return commit;
  }

  getChild(parentSha) {
    const children = this.commits.filter(
      commit => commit.parents.indexOf(parentSha) > -1
    );
    return children;
  }

  updateCommitPositions() {
    this.commits.map(commit => {
      const position = this.graph.positions.get(commit.hash);
      commit.x = position[1] * 30;
      commit.y = position[0] * 30;
    });
    console.log(this.graph.edges);
  }

  getGraphDeep() {
    this.commits.map(commit => {
      if (commit.parents.length > this.graphDeep)
        this.graphDeep = commit.parents.length - 1;
    });
  }

  computeCommitMessagesX(): number {
    let farX = 0;
    this.commits.map(commit => {
      if (commit.x > farX) farX = commit.x;
    });
    console.log('farX', farX);
    return farX;
  }

  getCommitBranches(commitSha) {
    const branches: Array<string> = [];
    for (const [branch, ref] of this.repo.references) {
      if (ref.target().tostrS() === commitSha) {
        branches.push(branch);
      }
    }
    return branches;
  }

  computeRenderedBranchesPaths(
    commits: Array<Commit<TNode>>
  ): BranchesPaths<TNode> {
    return new BranchesPathsCalculator(commits, this.branches, () =>
      createDeletedBranch(this, () => this.next())
    ).execute();
  }

  withPosition(
    rows: GraphRows,
    branchesOrder: BranchesOrder,
    commit: Commit
  ): Commit {
    const row = rows.getRowOf(commit.hash);

    const order = branchesOrder.get(commit.branchToDisplay);
    return commit.setPosition({
      x: this.initCommitOffsetX + 25 * order,
      y: this.initCommitOffsetY + 30 * row
    });
  }

  next() {
    if (this.nextTimeoutId) {
      window.clearTimeout(this.nextTimeoutId);
    }

    // Use setTimeout() with `0` to debounce call to next tick.
    this.nextTimeoutId = window.setTimeout(() => {
      this.listeners.forEach(listener => listener(this.getRenderedData()));
    }, 0);
  }
}
