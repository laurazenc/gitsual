import { Action, Dispatch, ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import ThemeManager, { Theme } from '../../../bin/ThemeManager'
import { AppState } from '../reducers'
import types from './index'

interface ThemeAction {
    type: string
    theme?: Theme
}

export type ThemeActions = ThemeAction

export const initTheme: ActionCreator<ThunkAction<void, Theme, null, ThemeAction>> = () => {
    return async (dispatch: Dispatch) => {
        const initThemeAction: ThemeAction = {
            type: types.INIT_THEME,
        }
        dispatch(initThemeAction)
    }
}
