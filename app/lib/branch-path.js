import { Commit } from './commit';
import { Branch } from './branch';
import { pick } from './utils';

type BranchesPaths = Map<Branch, Coordinate[][]>;

interface Coordinate {
  x: number,
  y: number
}

type InternalBranchesPaths = Map<Branch, InternalCoordinate[]>;

interface InternalCoordinate extends Coordinate {
  mergeCommit?: boolean;
}

export class BranchesPathsCalculator {
  commits: Array<Commit>;

  branches: Map<Branch.name, Branch>;

  commitSpacing: number;

  createDeletedBranch: () => Branch;

  branchesPaths: InternalBranchesPaths;

  constructor(
    commits: Array<Commit>,
    branches: Map<Branch.name, Branch>,
    createDeletedBranch: () => Branch
  ) {
    this.commits = commits;
    this.branches = branches;
    this.createDeletedBranch = createDeletedBranch;
    this.execute = this.execute;
    this.branchesPaths = new Map();
    this.commitSpacing = 25;
  }

  execute = (): BranchesPaths<TNode> => {
    this.fromCommits();
    this.withMergeCommits();
    return this.smoothBranchesPaths();
  };

  fromCommits() {
    console.log(this.branches);
    this.commits.forEach(commit => {
      // let branch = this.branches
      //   ? this.branches.get(commit.branchToDisplay[0])
      //   : null;
      let branch = this.branches.get(commit.branchToDisplay);

      if (!branch) {
        // NB: may not work properly if there are many deleted branches.
        branch = this.getDeletedBranchInPath() || this.createDeletedBranch();
      }
      const path: Coordinate[] = [];
      const existingBranchPath = this.branchesPaths.get(branch);
      const firstParentCommit = this.commits.find(
        ({ hash }) => hash === commit.parents[0]
      );

      if (existingBranchPath) {
        path.push(...existingBranchPath);
      } else if (firstParentCommit) {
        // Make branch path starts from parent branch (parent commit).
        path.push({ x: firstParentCommit.x, y: firstParentCommit.y });
      }

      path.push({ x: commit.x, y: commit.y });
      this.branchesPaths.set(branch, path);
    });
  }

  withMergeCommits() {
    const mergeCommits = this.commits.filter(
      ({ parents }) => parents.length > 1
    );
    mergeCommits.forEach(mergeCommit => {
      const parentOnOriginBranch = this.commits.find(({ hash }) => {
        return hash === mergeCommit.parents[1];
      });
      if (!parentOnOriginBranch) return;

      const originBranchName = parentOnOriginBranch.branches
        ? parentOnOriginBranch.branches[0]
        : '';
      let branch = this.branches.get(originBranchName);

      if (!branch) {
        branch = this.getDeletedBranchInPath();

        if (!branch) {
          // Still no branch? That's strange, we shouldn't set anything.
          return;
        }
      }

      const lastPoints = [...(this.branchesPaths.get(branch) || [])];
      this.branchesPaths.set(branch, [
        ...lastPoints,
        { x: mergeCommit.x, y: mergeCommit.y, mergeCommit: true }
      ]);
    });
  }

  getDeletedBranchInPath(): Branch | undefined {
    return Array.from(this.branchesPaths.keys()).find(branch =>
      branch.isDeleted()
    );
  }

  smoothBranchesPaths(): BranchesPaths {
    const branchesPaths = new Map();

    this.branchesPaths.forEach((points, branch) => {
      if (points.length <= 1) {
        branchesPaths.set(branch, [points]);
        return;
      }

      // Cut path on each merge commits
      // Coordinate[] -> Coordinate[][]
      // if (this.isGraphVertical) {
      points = points.sort((a, b) => (a.y > b.y ? -1 : 1));
      // } else {
      //   points = points.sort((a, b) => (a.x > b.x ? 1 : -1));
      // }

      // if (this.isGraphReverse) {
      //   points = points.reverse();
      // }

      const paths = points.reduce(
        (mem, point, i) => {
          if (point.mergeCommit) {
            mem[mem.length - 1].push(pick(point, ['x', 'y']));
            if (points[i - 1]) mem.push([points[i - 1]]);
          } else {
            mem[mem.length - 1].push(point);
          }
          return mem;
        },
        [[]]
      );

      // if (this.isGraphReverse) {
      //   paths.forEach(path => path.reverse());
      // }

      // Add intermediate points on each sub paths

      paths.forEach(subPath => {
        if (subPath.length <= 1) return;
        const firstPoint = subPath[0];
        const lastPoint = subPath[subPath.length - 1];
        const column = subPath[1].x;
        const branchSize =
          Math.round(
            Math.abs(firstPoint.y - lastPoint.y) / this.commitSpacing
          ) - 1;
        const branchPoints =
          branchSize > 0
            ? new Array(branchSize).fill(0).map((_, i) => ({
                x: column,
                y: subPath[0].y - this.commitSpacing * (i + 1)
              }))
            : [];
        const lastSubPaths = branchesPaths.get(branch) || [];
        branchesPaths.set(branch, [
          ...lastSubPaths,
          [firstPoint, ...branchPoints, lastPoint]
        ]);
      });
      // }
      //  else {
      //   paths.forEach(subPath => {
      //     if (subPath.length <= 1) return;
      //     const firstPoint = subPath[0];
      //     const lastPoint = subPath[subPath.length - 1];
      //     const column = subPath[1].y;
      //     const branchSize =
      //       Math.round(
      //         Math.abs(firstPoint.x - lastPoint.x) / this.commitSpacing
      //       ) - 1;
      //     const branchPoints =
      //       branchSize > 0
      //         ? new Array(branchSize).fill(0).map((_, i) => ({
      //             y: column,
      //             x: subPath[0].x + this.commitSpacing * (i + 1)
      //           }))
      //         : [];
      //     const lastSubPaths = branchesPaths.get(branch) || [];
      //     branchesPaths.set(branch, [
      //       ...lastSubPaths,
      //       [firstPoint, ...branchPoints, lastPoint]
      //     ]);
      //   });
      // }
    });

    return branchesPaths;
  }
}

export const toSvgPath = (
  coordinates: Coordinate[][],
  isBezier: boolean,
  isVertical: boolean
): string => {
  console.log(coordinates);
  return `M${coordinates
    .map(({ x, y }, i, points) => {
      if (
        isBezier &&
        points.length > 1 &&
        (i === 1 || i === points.length - 1)
      ) {
        const previous = points[i - 1];
        if (isVertical) {
          const middleY = (previous.y + y) / 2;
          return `C ${previous.x} ${middleY} ${x} ${middleY} ${x} ${y}`;
        }
        const middleX = (previous.x + x) / 2;
        return `C ${middleX} ${previous.y} ${middleX} ${y} ${x} ${y}`;
      }
      return `L ${x} ${y}`;
    })
    .join(' ')
    .slice(1)}`;
};
