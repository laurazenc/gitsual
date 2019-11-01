import {
  LOAD_REPO,
  LOAD_REPO_FAIL,
  INIT_SIDEBAR,
  INIT_SIDEBAR_FAIL,
  GET_BRANCHES
} from '../actions';

const initalState = {
  histories: [],
  historiesCurrentCommit: undefined,
  historiesHeadCommit: undefined,
  fileModifiedCount: 0,
  commitDiffFiles: [],
  commitInfo: undefined,
  diffPatches: [],
  unstagedPatches: [],
  stagedPatches: [],
  branches: [],
  stashes: [],
  stashPatches: [],
  currentBranch: undefined,
  currentOrigin: undefined,
  remotes: [],
  cloneFilePath: undefined,
  cloneProjectName: undefined,
  progress: 0,
  tags: [],
  tagCommit: undefined,
  submodules: [],
  validating: false
};

export default (state = initalState, action) => {
  switch (action.type) {
    case LOAD_REPO:
      return {
        ...state,
        repo: action.repo,
        projectName: action.projectName
      };
    case GET_BRANCHES:
      return {
        ...state,
        branches: action
      };
    case INIT_SIDEBAR:
      return {
        ...state,
        currentBranch: action.currentBranch || state.currentBranch,
        fileModifiedCount: action.fileModifiedCount || state.fileModifiedCount,
        branches: action.branches || state.branches,
        stashes: action.stashes || state.stashes,
        tags: action.tags || state.tags,
        submodules: action.submodules || state.submodules
      };
    case INIT_SIDEBAR_FAIL:
      return state;
    case LOAD_REPO_FAIL:
      return state;
    default:
      return state;
  }
};
