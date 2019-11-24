import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import ThemeManager, { Theme } from '../../../bin/ThemeManager'
import { AppState } from '../reducers'
import types from './index'



interface InitThemeAction {
	type: typeof types.INIT_THEME
	theme: Theme
}


export const initTheme = (): ThunkAction<void, AppState, null, Action<string>> => {
	return async (dispatch) => {
		const theme = new ThemeManager()		
		await theme.load()
		dispatch({ type: types.INIT_THEME, theme })
	}
}

export type ThemeActionTypes = InitThemeAction

