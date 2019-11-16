import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

export interface RootState {
    router: any;
}

export default function createRootReducer(history) {
    return combineReducers<RootState | undefined>({
        router: connectRouter(history)
    });
}
