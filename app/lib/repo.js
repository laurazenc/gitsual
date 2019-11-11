// @flow
import * as Git from 'nodegit';
import Logger from '../utils/logger';
import { GitGraph } from './git-graph';

export class RepoBuilder {
  repo: Git.Repository;

  path: string;

  name: string;

  commits: Git.Commit[];

  head: string | null;

  headCommit: Git.Commit | null;

  references: Map<string, Git.Reference>;

  tags: Map<string, Git.Tag>;

  parents: Map<string, string[]>;

  children: Map<string, string[]>;

  shaToCommit: Map<string, Git.Commit>;

  shaToIndex: Map<string, number>;

  shaToReferences: Map<string, string[]>;

  graph: GitGraph;

  currentBranch: Git.Reference;

  constructor(repo: Git.Repository, name: string) {
    this.repo = repo;
    this.path = this.repo.path();
    this.name = name;
    this.commits = [];
    this.stashes = new Map<string, Stash>();
    this.tags = new Map<string, Git.Tag>();
    this.references = new Map<string, Git.Reference>();
    this.parents = new Map<string, string[]>();
    this.children = new Map<string, string[]>();

    this.shaToCommit = new Map<string, Git.Commit>();
    this.shaToIndex = new Map<string, number>();
    this.shaToReferences = new Map<string, string[]>();

    this.getBranches = this.getBranches;
    this.getReferenceValues = this.getReferenceValues;
    this.getCommit = this.getCommit;
    this.getReferenceNames = this.getReferenceNames;
  }

  async init() {
    await this.getCommits();
    await this.getHead();
    await this.getGraph();
  }

  static async create(repo: Git.Repository, name: string) {
    const o = new RepoBuilder(repo, name);
    await o.init();
    return o;
  }

  async getCommits() {
    // branch, Reference
    const references = await this.prepareReferences();
    // stash, Reference
    const stashes = await this.prepareStashes();
    const newCommits = await this.getNewCommits(references, stashes);
    await this.prepareTags();
    // this.updateShaToReferences();
    await this.getParents(newCommits);
    // this.removeUnreachableCommits();
    // await this.hideStashSecondParents(stashes);
    await this.sortCommits();
  }

  async prepareReferences() {
    try {
      const references = await this.getReferences();
      const referencesToUpdate: string[] = [];
      const newReferences = new Map<string, Git.Reference>();
      for (const reference of references) {
        const name = reference.name();
        const commitSha = reference.target().tostrS();
        if (
          !this.references.has(name) ||
          this.references
            .get(name)
            .target()
            .tostrS() !== commitSha
        ) {
          referencesToUpdate.push(name);
        }
        newReferences.set(name, reference);
      }
      this.references = newReferences;
      return referencesToUpdate;
    } catch (e) {
      throw new Error(e);
    }
  }

  async prepareStashes() {
    const stashes = await this.getStashes();
    const stashesToUpdate: Stash[] = [];
    for (const [sha, stash] of stashes) {
      if (!this.stashes.has(sha)) {
        stashesToUpdate.push(stash);
      }
    }
    this.stashes = stashes;
    return stashesToUpdate;
  }

  async prepareTags() {
    this.tags = new Map(
      await Promise.all(
        this.getReferenceValues()
          .filter(
            reference =>
              reference.isTag() &&
              !this.shaToCommit.has(reference.target().tostrS())
          )
          .map(async reference => [
            reference.name(),
            await this.repo.getTag(reference.target())
          ])
      )
    );
  }

  async getReferences() {
    try {
      const references = await this.repo.getReferences();
      return references.filter(reference => reference.name() !== 'refs/stash');
    } catch (e) {
      throw new Error(e);
    }
  }

  async getStashes() {
    const oids: Git.Oid[] = [];
    await Git.Stash.foreach(
      this.repo,
      (index: Git.Index, message: string, oid: Git.Oid) => {
        oids.push(oid);
      }
    );
    const commits = await Promise.all(
      oids.map(oid => this.repo.getCommit(oid))
    );
    return new Map<string, Stash>(
      commits.map((commit, index) => [commit.sha(), new Stash(index, commit)])
    );
  }

  async getNewCommits(references: string[], stashes: Stash[]) {
    const walker = Git.Revwalk.create(this.repo);
    for (const name of references) {
      walker.pushRef(name);
    }
    for (const stash of stashes) {
      walker.push(stash.commit.id());
    }
    for (const commit of this.commits) {
      walker.hide(commit.id());
    }
    // Retrieve new commits
    const newCommits = await walker.getCommitsUntil(() => true);
    for (const commit of newCommits) {
      this.commits.push(commit);
      this.shaToCommit.set(commit.sha(), commit);
    }
    return newCommits;
  }

  updateShaToReferences() {
    this.shaToReferences.clear();
    for (const [name, reference] of this.references) {
      const commitSha = this.tags.has(name)
        ? this.tags
            .get(name)
            .targetId()
            .tostrS()
        : reference.target().tostrS();
      if (!this.shaToReferences.has(commitSha)) {
        this.shaToReferences.set(commitSha, []);
      }
      this.shaToReferences.get(commitSha).push(name);
    }
  }

  getParents(commits: Git.Commit[]) {
    for (const commit of commits) {
      this.children.set(commit.sha(), []);
    }
    for (const commit of commits) {
      const commitSha = commit.sha();
      const parentShas = commit.parents().map(oid => oid.tostrS());
      this.parents.set(commitSha, parentShas);

      for (const parentSha of parentShas) {
        this.children.get(parentSha).push(commitSha);
      }
    }
  }

  async sortCommits() {
    const dfs = (commit: Git.Commit) => {
      const commitSha = commit.sha();
      if (alreadySeen.get(commitSha)) {
        return;
      }
      alreadySeen.set(commitSha, true);
      for (const childSha of this.children.get(commitSha)) {
        dfs(this.shaToCommit.get(childSha));
      }
      sortedCommits.push(commit);
    };

    // Sort the commits by date (from newer to older)
    const commitsWithTime = this.commits.map(commit => [
      commit.date().valueOf(),
      commit
    ]);
    commitsWithTime.sort((lhs, rhs) => rhs[0] - lhs[0]);
    this.commits = commitsWithTime.map(([, commit]) => commit);
    // Topological sort (from parent to children)
    const sortedCommits: Git.Commit[] = [];
    const alreadySeen = new Map<string, boolean>();
    for (const commit of this.commits) {
      dfs(commit);
    }
    this.commits = sortedCommits;
    // Update shaToIndex
    this.shaToIndex = new Map(
      this.commits.map((commit, i) => [commit.sha(), i])
    );
  }

  async getHead() {
    try {
      this.head = (await this.repo.head()).name();
    } catch (e) {
      this.head = null;
    }
    this.headCommit = await this.repo.getHeadCommit();
    this.currentBranch = await this.repo.getCurrentBranch();
  }

  async getGraph() {
    this.graph = await GitGraph.create(this);
  }

  getBranches() {
    const references = this.getReferenceValues();
    const localBranches = references.filter(reference => reference.isBranch());
    const remoteBranches = references.filter(reference => reference.isRemote());
    return { localBranches, remoteBranches };
  }

  async getReferenceNames() {
    const refNames = new Map<string, string>();
    const refs = await this.repo.getReferences();
    const branches = refs.filter(reference => !reference.isHead());
    branches.map(branch => {
      const name = branch.name();
      refNames.set(name, branch.target().tostrS());
    });
    return refNames;
  }

  getReferenceValues() {
    return [...this.references.values()];
  }

  getCommit(sha) {
    let commitInfo = null;
    this.commits.map(commit => {
      if (sha === commit.sha()) {
        commitInfo = commit;
      }
    });
    return commitInfo;
  }
}
