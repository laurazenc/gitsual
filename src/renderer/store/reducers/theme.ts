import ThemeManager, { Theme } from '../../../bin/ThemeManager'
import { Reducer } from 'redux'
import types from '../actions'
import { defaultTheme } from '../../../shared/theme'

import { ThemeActionTypes } from '../actions/theme'


const initialState = {
	theme: defaultTheme
}

export interface InitThemeReducer {
	theme: Theme
}


const themeReducer = (state = initialState, actions: ThemeActionTypes) => {
	switch (actions.type) {
		case types.INIT_THEME:
			return {
				...state,
				theme: actions.theme
			}
			break

		default:
			return state
			break
	}
}

export default themeReducer

export type ThemeReducerTypes = InitThemeReducer
