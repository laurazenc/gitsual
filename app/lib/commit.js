// @flow
import * as Git from 'nodegit';
import { Refs } from './refs';

interface CommitRenderOptions<TNode> {
  renderDot?: (commit: Commit<TNode>) => TNode;
  renderMessage?: (commit: Commit<TNode>) => TNode;
  renderTooltip?: (commit: Commit<TNode>) => TNode
}

interface CommitOptions<TNode> extends CommitRenderOptions<TNode> {
  author: string;
  subject: string;
  body?: string;
  hash?: string;
  parents?: string[];
  dotText?: string
  // onClick?: (commit: Commit<TNode>) => void,
  // onMessageClick?: (commit: Commit<TNode>) => void,
  // onMouseOver?: (commit: Commit<TNode>) => void,
  // onMouseOut?: (commit: Commit<TNode>) => void
}

export class Commit {
  x: number = 0;

  y: number = 0;

  hash: CommitOptions.hash;

  hashAbbrev: string;

  parents: Array<string>;

  parentsAbbrev: Array<string>;

  date: CommitOptions.date;

  author: {
    name: string,
    email: string,
    timestamp: number
  };

  committer: {
    name: string,
    email: string,
    timestamp: number
  };

  subject: string;

  body: string;

  get message() {
    let message = '';

    message += this.subject;
    message += ` - ${this.author.name} <${this.author.email}>`;

    return message;
  }

  dotText: string;

  branches: Array<string>;

  tags: Tag[];

  constructor(options: CommitOptions<TNode>) {
    this.author = options.author;
    this.committer = options.committer;

    // Set commit message
    this.subject = options.subject;
    this.body = options.body || '';

    // Set commit hash
    this.hash = options.hash;
    this.hashAbbrev = this.hash.substring(0, 7);
    this.date = options.date;

    // Set parent hash
    this.parents = options.parents
      ? options.parents.map(parent => parent.tostrS())
      : [];
    this.parentsAbbrev = this.parents.map(commit => commit.substring(0, 7));

    this.dotText = options.dotText;
    this.setBranches = this.setBranches;
    this.setRefs = this.setRefs;
    this.setPosition = this.setPosition;
    this.isBranch = this.isBranch;
    this.isMerged = this.isMerged;
  }

  isBranch(): boolean {
    return this.branches.length > 0;
  }

  isMerged(): boolean {
    return !this.isBranch() && this.parents.length > 1;
  }

  setPosition({ x, y }: { x: number, y: number }): this {
    this.x = x;
    this.y = y;
    return this;
  }

  setBranches(branches: Array<string>): this {
    this.branches = branches;
    this.branchToDisplay = this.getBranchToDisplay();
    return this;
  }

  setRefs(refs: Refs): this {
    this.refs = refs.getNames(this.hash);
    return this;
  }

  getBranchToDisplay(): string {
    return this.branches ? this.branches[0] : '';
  }
}
