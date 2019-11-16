import { createStore, applyMiddleware, Store } from 'redux';
import reduxThunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import reducers from './reducers';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

function configureStore(initialState: any): Store {
    return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
