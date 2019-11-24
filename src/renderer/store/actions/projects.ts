import { remote } from 'electron'

import { Action, Dispatch  } from 'redux'
import { ThunkAction } from 'redux-thunk'
import * as Git from 'nodegit'
import ProjectManager from '../../../bin/ProjectManager'


import { AppState } from '../reducers'
import { Project } from '../reducers/projects'
import types from './index'

const { Repository } = Git

interface ProjectsAction {
	type: typeof types.LOAD_PROJECTS
	projects?: string[]
	error?: string | null
}

const pManager = new ProjectManager()

export const openProject = (): ThunkAction<void, AppState, null, Action<string>> => {
	return async (dispatch: Dispatch) => {
		dispatch({ type: types.OPEN_PROJECT })
		try {
			await pManager.initDatabase()
			const { dialog } = remote
			
			const result: any = await dialog.showOpenDialog(remote.getCurrentWindow(), { properties: ['openDirectory'] })
			
			if (!result.filePaths.length) {
				dispatch({
					type: types.OPEN_PROJECT_FAIL,
					error: 'No repo selected'
				})
			}						
			
			const filePath = result.filePaths[0]	

			const fileName = filePath.replace(/^.*[\\\/]/, '/') // eslint-disable-line
			const projectName = fileName.split('/').reverse()[0]			
			/* const repo = await Repository.open(filePath) */
									
			await pManager.db
				.get('projects')
				.push({
					name: projectName,
					path: filePath
				})
				.write()

			dispatch({ type: types.OPEN_PROJECT_SUCCESS })
			
		} catch(error) {
			dispatch({ type: types.OPEN_PROJECT_FAIL, error })
		}
	}
}

export const loadProjects = (): ThunkAction<void, AppState, null, Action<string>> => {
	return async (dispatch: Dispatch) => {
		dispatch({ type: types.LOAD_PROJECTS })
		try {
			
			await pManager.initDatabase()
			const existingProjects = pManager.db.get('projects').value()			
			const projects = [] as Project[]
	
			if(existingProjects && existingProjects.length > 0) {
				for (const value of existingProjects) { // eslint-disable-line
					projects.push(value)
				}
			}
	
			dispatch({ type: types.LOAD_PROJECTS_SUCCESS, projects })
		} catch(error) {
			dispatch({ type: types.LOAD_PROJECTS_FAIL, error })
		}
	}
}

export type ProjectsActionTypes = ProjectsAction

