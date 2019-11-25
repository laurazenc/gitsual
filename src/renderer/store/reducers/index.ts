import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import projectsReducer from './projects'
import themeReducer from './theme'

export interface RootState {
	router: any,
	theme: any,
	projects: any
}

const createRootReducer = (history: any) => {
	return combineReducers<RootState | undefined>({
		router: connectRouter(history),
		theme: themeReducer,
		projects: projectsReducer
	})
}

export default createRootReducer

export type AppState = ReturnType<typeof createRootReducer>

