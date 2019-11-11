// @flow
import low from 'lowdb';
import nodegit from 'nodegit';
import { DB_PATH } from '../../constants';

import { LOAD_REPO, LOAD_REPO_FAIL } from './index'; // eslint-disable-line

import { Dispatch } from '../types';
import { RepoBuilder } from '../../lib/repo';

const FileASync = require('lowdb/adapters/FileASync'); // eslint-disable-line
const adapter = new FileASync(DB_PATH);
const db = low(adapter);
const { Repository } = nodegit;

export const loadRepo = (projectName: string) => {
  return async (dispatch: Dispatch) => {
    try {
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
      const gitRepository: Repository = await Repository.open(dirPath);
      // build repo
      const repo = await RepoBuilder.create(gitRepository, projectName);
      dispatch({
        type: LOAD_REPO,
        repo,
        projectName
      });
    } catch (e) {
      dispatch({
        type: LOAD_REPO_FAIL,
        msg: e
      });
    }
  };
};
