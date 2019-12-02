import { Reducer } from 'redux'
import types from '../actions'

import { ProjectActions } from '../actions/projects'

export interface Project {
    name: string
    path: string
}

export interface ProjectState {
    projects?: Project[]
    isLoadingProjects: boolean
    error?: string | null
}

export const initialState: ProjectState = {
    projects: [],
    isLoadingProjects: false,
    error: null,
}

const projectsReducer: Reducer<ProjectState | any, ProjectActions> = (state = initialState, actions) => {
    switch (actions.type) {
        case types.LOAD_PROJECTS:
            return {
                ...initialState,
                isLoadingProjects: true,
            }

        case types.LOAD_PROJECTS_SUCCESS:
            return {
                ...initialState,
                projects: actions.projects,
                isLoadingProjects: false,
            }

        case types.LOAD_PROJECTS_FAIL:
            return {
                ...initialState,
                isLoadingProjects: false,
                error: actions.error,
            }

        case types.OPEN_PROJECT:
            return {
                ...state,
                isLoadingProjects: true,
            }

        case types.OPEN_PROJECT_SUCCESS:
            return {
                ...state,
                isLoadingProjects: false,
            }

        case types.OPEN_PROJECT_FAIL:
            return {
                ...state,
                isLoadingProjects: false,
                error: actions.error,
            }

        default:
            return state
    }
}

export default projectsReducer
