import { Reducer } from 'redux'
import types from '../actions'

import { ProjectsActionTypes } from '../actions/projects'

export interface Project {
	name: string,
	path: string
}


const initialState = {
	projects: [],
	isLoadingProjects: false,
	error: null

}

export interface ProjectsReducer {
	projects: Project[],
	isLoadingProjects: boolean,
	error: string | null
}


const projectsReducer = (state = initialState, actions: ProjectsActionTypes) => {
	switch (actions.type) {
		case types.LOAD_PROJECTS:
			return {
				...initialState,				
				isLoadingProjects: true
			}
			break
		case types.LOAD_PROJECTS_SUCCESS:
			return {
				...initialState,
				projects: actions.projects,
				isLoadingProjects: false
			}
			break
		case types.LOAD_PROJECTS_FAIL:
			return {
				...initialState,
				isLoadingProjects: false,
				error: actions.error
			}
			break
		case types.OPEN_PROJECT:
			return {
				...state,			
				isLoadingProjects: true
			}
			break
		case types.OPEN_PROJECT_SUCCESS:
			return {
				...state,
				isLoadingProjects: false
			}
			break
		case types.OPEN_PROJECT_FAIL:
			return {
				...state,
				isLoadingProjects: false,
				error: actions.error
			}
			break

		default:
			return state
			break
	}
}

export default projectsReducer

export type ProjectsReducerTypes = ProjectsReducer
