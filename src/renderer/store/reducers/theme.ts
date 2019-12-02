import { Reducer } from 'redux'
import { Theme } from '../../../bin/ThemeManager'
import { defaultTheme } from '../../../shared/theme'
import types from '../actions'

import { ThemeActions } from '../actions/theme'

export interface ThemeState {
    theme: Theme
}

export const initialState: ThemeState = {
    theme: defaultTheme,
}

const themeReducer: Reducer<ThemeState | any, ThemeActions> = (state = initialState, actions) => {
    switch (actions.type) {
        case types.INIT_THEME:
            return {
                ...state,
                theme: actions.theme,
            }

        default:
            return state
    }
}

export default themeReducer
