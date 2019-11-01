import { remote } from 'electron';
import low from 'lowdb';
import { DB_PATH } from '../../constants';

import { LIST_PROJECT, LOAD_PROJECT, LOAD_PROJECT_FAIL } from './index';

const nodegit = require('nodegit');
const FileASync = require('lowdb/adapters/FileASync'); // eslint-disable-line

const { Repository } = nodegit;

const adapter = new FileASync(DB_PATH);

const db = low(adapter);

export const findProject = () => {
  return async dispatch => {
    const database = await db;
    database.defaults({ projects: [] }).value();
    const { dialog } = remote;
    dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      filenames => {
        if (!filenames) return;
        if (filenames.length > 0) {
          const filePath = filenames[0];
          const projectName = filePath.split('/').reverse()[0];
          Repository.open(filePath)
            .then(repo => {
              database
                .get('projects')
                .push({
                  name: projectName,
                  path: filePath
                })
                .write();
              dispatch({
                type: LOAD_PROJECT,
                repo
              });
              dispatch(listProject(database));
              // Go to repo page
            })
            .catch(e => {
              dispatch({
                type: LOAD_PROJECT_FAIL,
                msg: e
              });
            });
        } else {
          dispatch({
            type: LOAD_PROJECT_FAIL
          });
        }
      }
    );
  };
};

export const listProject = () => {
  return async dispatch => {
    const database = await db;
    const projects = database.get('projects').value();
    const newProjects = [];
    if (projects && projects.length > 0) {
      for (const value of projects) {
        newProjects.push(value);
      }
    }
    dispatch({
      type: LIST_PROJECT,
      projects: newProjects
    });
  };
};
