import { remote } from 'electron'
import low from 'lowdb'
const nodegit = require('nodegit');
const FileASync = require('lowdb/adapters/FileASync')
import { join } from 'path'
import { DB_PATH } from '../../constants'

import { LIST_PROJECT, LOAD_PROJECT, LOAD_PROJECT_FAIL } from './'

const { Repository } = nodegit

const adapter = new FileASync(DB_PATH)

const db = low(adapter)


export const findProject = () => {
  return async dispatch => {
    const database = await db
    database.defaults({ projects: [] }).value()
    const dialog = remote.dialog
    dialog.showOpenDialog({
      properties: ['openDirectory'],
    }, (filenames) => {
      if (!filenames) return
      if (filenames.length > 0) {
        const filePath = filenames[0]
        const projectName = filePath.split('\/').reverse()[0]
        Repository.open(filePath).then((repo) => {
          database.get('projects').push({
            name: projectName,
            path: filePath,
          }).write()
          dispatch({
            type: LOAD_PROJECT,
            repo: repo,
          })
          dispatch(listProject(database))
          // Go to repo page
        }).catch((e) => {
          dispatch({
            type: LOAD_PROJECT_FAIL,
            msg: e,
          })
        })
      } else {
        dispatch({
          type: LOAD_PROJECT_FAIL,
        })
      }
    })
  }
}

// export const removeProject = (projectName) => {
//   return dispatch => {
//     db.get('projects')
//       .remove({ name: projectName })
//       .value()
//     dispatch({
//       type: REMOVE_PROJECT,
//     })
//     dispatch(listProject())
//   }
// }

// export const FIND_CLONE_PATH = 'FIND_CLONE_PATH'
// export const findClonePath = () => {
//   return dispatch => {
//     const dialog = remote.dialog
//     dialog.showOpenDialog({
//       properties: ['openDirectory'],
//     }, (filenames) => {
//       if (!filenames) return
//       if (filenames.length > 0) {
//         const filePath = filenames[0]
//         const projectName = filePath.split('\/').reverse()[0]
//         dispatch({
//           type: FIND_CLONE_PATH,
//           cloneFilePath: filePath,
//           cloneProjectName: projectName,
//         })
//       }
//     })
//   }
// }

export const listProject = () => {
  return async dispatch => {
  console.log('listing')
  const database = await db
  const projects = database.get('projects').value()
  console.log('listProject', projects);
  const newProjects = []
    if (projects && projects.length > 0) {
      for (let value of projects) {
        newProjects.push(value)
      }
    }
    dispatch({
      type: LIST_PROJECT,
      projects: newProjects,
    })
  }
}
