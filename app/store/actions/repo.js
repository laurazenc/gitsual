// @flow
import low from 'lowdb';
import nodegit from 'nodegit';
import { DB_PATH } from '../../constants';

import { LOAD_REPO, LOAD_REPO_FAIL } from './index'; // eslint-disable-line

import { Dispatch } from '../types';

const FileASync = require('lowdb/adapters/FileASync');

const adapter = new FileASync(DB_PATH);
const db = low(adapter);

const { Repository, Diff } = nodegit;

export const loadRepo = (projectName: string) => {
  return async (dispatch: Dispatch) => {
    const database = await db;
    const result = database
      .get('projects')
      .find({ name: projectName })
      .value();
    if (!result)
      dispatch({
        type: LOAD_REPO_FAIL,
        msg: 'not found'
      });
    const dirPath = result.path;
    Repository.open(dirPath)
      .then(repo => {
        dispatch({
          type: LOAD_REPO,
          repo,
          projectName
        });
      })
      .catch(e => {
        dispatch({
          type: LOAD_REPO_FAIL,
          msg: e
        });
      });
  };
};

export const initSideBar = repo => {
  return async dispatch => {
    const data = {};
    try {
      const commit = await repo.getHeadCommit();
      const tree = await commit.getTree();
      const diff = await Diff.treeToWorkdirWithIndex(repo, tree, {
        flags:
          Diff.OPTION.SHOW_UNTRACKED_CONTENT ||
          Diff.OPTION.RECURSE_UNTRACKED_DIRS
      });
      const arrayConvenientPatch = await diff.patches();
      data.fileModifiedCount = arrayConvenientPatch.length;
      const arrayReference = await repo.getReferences();
      data.branches = arrayReference.filter(reference => {
        // don't know why isBranch not work suddenly
        // return reference.isBranch() === 1
        return (
          reference.name().indexOf('refs/heads') !== -1 ||
          reference.name().indexOf('refs/remotes') !== -1
        );
      });
      //   return Helper.getStashes(repo)
      // }).then((stashes) => {
      //   data.stashes = stashes
      //   return Helper.listTags(repo)
      // }).then((tags) => {
      //   data.tags = tags
      //   return repo.getSubmoduleNames()
      // }).then((submodules) => {
      //   data.submodules = submodules
      data.currentBranch = await repo.getCurrentBranch();
      dispatch({
        type: INIT_SIDEBAR,
        ...data
      });
    } catch (e) {
      dispatch({
        type: INIT_SIDEBAR_FAIL,
        msg: e
      });
    }
  };
};
