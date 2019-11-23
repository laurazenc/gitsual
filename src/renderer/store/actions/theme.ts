import { Action } from 'redux'
import ThemeManager, { Theme } from '../../../bin/ThemeManager'
import types from './index'
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../reducers'



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

