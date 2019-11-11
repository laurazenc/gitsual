// @flow

type Name = string;

export class Refs {
  commitPerName: Map<Name, string>;

  namesPerCommit: Map<string, Name[]>;

  constructor() {
    this.commitPerName = new Map<Name, string>();
    this.namesPerCommit = new Map<string, Name[]>();
    this.getNames = this.getNames;
    this.hasCommit = this.hasCommit;
    this.getCommit = this.getCommit;
    this.set = this.set;
  }

  set(name: Name, commitHash: Commit.hash): this {
    const prevCommitHash = this.commitPerName.get(name);
    if (prevCommitHash) {
      this.removeNameFrom(prevCommitHash, name);
    }

    this.addNameTo(commitHash, name);
    this.addCommitTo(name, commitHash);

    return this;
  }

  getNames(commitHash: string): Name[] {
    return this.namesPerCommit.get(commitHash) || [];
  }

  hasCommit(commitHash: Commit.hash): boolean {
    return this.namesPerCommit.has(commitHash);
  }

  getCommit(name: Name): Commit.hash | undefined {
    return this.commitPerName.get(name);
  }

  addNameTo(commitHash: Commit.hash, nameToAdd: Name): void {
    const prevNames = this.namesPerCommit.get(commitHash) || [];
    this.namesPerCommit.set(commitHash, [...prevNames, nameToAdd]);
  }

  addCommitTo(name: Name, commitHashToAdd: Commit.hash): void {
    this.commitPerName.set(name, commitHashToAdd);
  }

  removeNameFrom(commitHash: Commit.hash, nameToRemove: Name): void {
    const names = this.namesPerCommit.get(commitHash) || [];

    this.namesPerCommit.set(
      commitHash,
      names.filter(name => name !== nameToRemove)
    );
  }
}
