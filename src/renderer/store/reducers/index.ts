import { connectRouter, RouterState } from 'connected-react-router'
import { combineReducers } from 'redux'

import projectsReducer, { ProjectState } from './projects'
import themeReducer, { ThemeState } from './theme'

export interface AppState {
    projects: ProjectState
    router: RouterState
    theme: ThemeState
}

const createRootReducer = (history: any) => {
    return combineReducers<AppState>({
        router: connectRouter(history),
        projects: projectsReducer,
        theme: themeReducer,
    })
}

export default createRootReducer
