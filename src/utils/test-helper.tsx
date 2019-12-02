import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import { createStore, AnyAction, Middleware } from 'redux'
import { BrowserRouter } from 'react-router-dom'

import configureStore, { MockStoreEnhanced, MockStoreCreator } from 'redux-mock-store'
import thunk, { ThunkDispatch } from 'redux-thunk'

import { defaultTheme } from '../shared/theme'
import { createHashHistory } from 'history'

import { initialState as projectsInitState } from '../renderer/store/reducers/projects'
import { initialState as themeInitState } from '../renderer/store/reducers/theme'

const initialState = {
    projects: projectsInitState,
    theme: themeInitState,
}
const middlewares: Array<Middleware> = [thunk]
type DispatchExts = ThunkDispatch<any, undefined, AnyAction>
const mockStoreCreator: MockStoreCreator<any, DispatchExts> = configureStore<any, DispatchExts>(middlewares)

interface Options {
    mocked?: boolean
    customState?: any
}

const customRender = (ui: React.ReactElement<any>, options: Options = {}) => {
    const { mocked = false, customState = null } = options

    const mockStore: MockStoreEnhanced<any, DispatchExts> = mockStoreCreator(
        mocked ? Object.assign(initialState, customState) : initialState,
    )

    return {
        store: mockStore,
        ...render(
            <Provider store={mockStore}>
                <ThemeProvider theme={defaultTheme}>
                    <BrowserRouter>{ui}</BrowserRouter>
                </ThemeProvider>
            </Provider>,
        ),
    }
}

export * from '@testing-library/react'

export { customRender as render }
