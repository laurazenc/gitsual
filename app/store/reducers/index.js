import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import project from './project';
import repo from './repo';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    project,
    repo
  });
}
