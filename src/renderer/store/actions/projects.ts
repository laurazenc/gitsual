import { remote } from 'electron'

import { Action, Dispatch, ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import * as Git from 'nodegit'
import ProjectManager from '../../../bin/ProjectManager'

import { AppState } from '../reducers'
import { Project } from '../reducers/projects'
import types from '.'

const { Repository } = Git

interface ProjectAction extends Action<string> {
    type: string
    projects?: Project[]
    error?: string | null
}

export type ProjectActions = ProjectAction

export const openProject: ActionCreator<ThunkAction<void, Project[], null, ProjectAction>> = () => {
    return async (dispatch: Dispatch) => {
        const openingProjectAction: ProjectAction = {
            type: types.OPEN_PROJECT,
        }
        dispatch(openingProjectAction)
        try {
            const pManager = new ProjectManager()

            await pManager.initDatabase()
            const { dialog } = remote

            const result: any = await dialog.showOpenDialog(remote.getCurrentWindow(), {
                properties: ['openDirectory'],
            })

            if (!result.filePaths.length) {
                const openProjectFailAction: ProjectAction = {
                    type: types.OPEN_PROJECT_FAIL,
                    error: 'No repo selected',
                }

                dispatch(openProjectFailAction)
            }

            const filePath = result.filePaths[0]

			const fileName = filePath.replace(/^.*[\\\/]/, '/') // eslint-disable-line
            const projectName = fileName.split('/').reverse()[0]
            /* const repo = await Repository.open(filePath) */

            const projects: any = pManager.db.get('projects')
            projects
                .push({
                    name: projectName,
                    path: filePath,
                })
                .write()

            const openProjectSuccessAction: ProjectAction = {
                type: types.OPEN_PROJECT_SUCCESS,
            }

            dispatch(openProjectSuccessAction)
        } catch (error) {
            const openProjectFailAction: ProjectAction = {
                type: types.OPEN_PROJECT_FAIL,
                error,
            }

            dispatch(openProjectFailAction)
        }
    }
}

export const loadProjects: ActionCreator<ThunkAction<void, Project[], null, ProjectAction>> = () => {
    return async (dispatch: Dispatch) => {
        const loadProjectsAction: ProjectAction = {
            type: types.LOAD_PROJECTS,
        }
        dispatch(loadProjectsAction)
        try {
            const pManager = new ProjectManager()

            const result = await pManager.initDatabase()

            const existingProjects = result.db.get('projects').value()
            const projects = [] as Project[]

            if (existingProjects && existingProjects.length > 0) {
				for (const value of existingProjects) { // eslint-disable-line
                    projects.push(value)
                }
            }
            const loadProjectsSuccessAction: ProjectAction = {
                type: types.LOAD_PROJECTS_SUCCESS,
                projects,
            }
            dispatch(loadProjectsSuccessAction)
        } catch (error) {
            const loadProjectsFailAction: ProjectAction = {
                type: types.LOAD_PROJECTS_FAIL,
                error,
            }

            dispatch(loadProjectsFailAction)
        }
    }
}
