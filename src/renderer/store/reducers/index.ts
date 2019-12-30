import { connectRouter, RouterState } from 'connected-react-router'
import { combineReducers } from 'redux'

import projectsReducer, { ProjectState } from './projects'
import themeReducer, { ThemeState } from './theme'
import repoReducer, { RepoState } from './repo'

export interface AppState {
    projects: ProjectState
    router: RouterState
    theme: ThemeState
    repo: RepoState
}

const createRootReducer = (history: any) => {
    return combineReducers<AppState>({
        router: connectRouter(history),
        projects: projectsReducer,
        theme: themeReducer,
        repo: repoReducer,
    })
}

export default createRootReducer
