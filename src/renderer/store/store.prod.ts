import { routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import createRootReducer, { AppState } from './reducers'

const history = createHashHistory()
const rootReducer = createRootReducer(history)
const router = routerMiddleware(history)
const enhancer = applyMiddleware(thunk, router)
function configureStore(initialState: any): Store<AppState> {
    return createStore(rootReducer, initialState, enhancer)
}

export default { configureStore, history }
