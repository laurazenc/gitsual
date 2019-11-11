import { RepoBuilder } from '../../lib/repo';
import * as types from '../actions';

const initalState = {
  repo: RepoBuilder
};

export default (state = initalState, action) => {
  switch (action.type) {
    case types.LOAD_REPO:
      return {
        ...state,
        repo: action.repo
      };
    default:
      return state;
  }
};
