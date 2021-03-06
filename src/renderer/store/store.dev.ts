import { routerActions, routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, compose, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import loggerMiddleware from './logger-middleware'

import createRootReducer, { AppState } from './reducers'

const history = createHashHistory()

const rootReducer = createRootReducer(history)

const configureStore = (initialState: any): Store<AppState> => {
    // Redux Configuration
    const middleware = [] as any
    const enhancers = [] as any

    // Thunk Middleware
    middleware.push(thunk)

    // Skip redux logs in console during the tests
    if (process.env.NODE_ENV !== 'test') {
        middleware.push(loggerMiddleware)
    }

    // Router Middleware
    const router = routerMiddleware(history)
    middleware.push(router)

    // Redux DevTools Configuration
    const actionCreators = {
        ...routerActions,
    }
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Options: http://extension.remotedev.io/docs/API/Arguments.html
              actionCreators,
          })
        : compose
    /* eslint-enable no-underscore-dangle */

    // Apply Middleware & Compose Enhancers
    enhancers.push(applyMiddleware(...middleware))
    const enhancer = composeEnhancers(...enhancers)

    // Create Store
    const store = createStore(rootReducer, initialState, enhancer)

    if ((module as any)['hot']) {
        const h = (module as any)['hot']
        h.accept(
            './reducers',
            // eslint-disable-next-line global-require
            () => store.replaceReducer(require('./reducers').default),
        )
    }

    return store
}

export default { configureStore, history }
