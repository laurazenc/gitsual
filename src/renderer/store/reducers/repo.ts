import { Repository } from '../../../bin/RepoBuilder'
import { Reducer } from 'react'

import types from '../actions'

import { RepoActions } from '../actions/repo'

export interface RepoState {
    repo?: Repository | null
    isLoadingRepo: boolean
    error?: string | null
}

export const initialState: RepoState = {
    repo: null,
    isLoadingRepo: false,
    error: null,
}

const repoReducer: Reducer<RepoState | any, RepoActions> = (state = initialState, actions) => {
    switch (actions.type) {
        case types.OPEN_REPO:
            return {
                ...initialState,
                isLoadingRepo: true,
            }

        case types.OPEN_REPO_SUCCESS:
            return {
                ...initialState,
                repo: actions.repo,
                isLoadingRepo: false,
            }

        case types.OPEN_REPO_FAIL:
            return {
                ...initialState,
                isLoadingRepo: false,
                error: actions.error,
            }
        default:
            return state
    }
}

export default repoReducer
