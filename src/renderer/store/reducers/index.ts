import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import themeReducer from './theme'

export interface RootState {
	router: any,
	theme: any
}

const createRootReducer = (history: any) => {
	return combineReducers<RootState | undefined>({
		router: connectRouter(history),
		theme: themeReducer
	})
}

export default createRootReducer

export type AppState = ReturnType<typeof createRootReducer>

