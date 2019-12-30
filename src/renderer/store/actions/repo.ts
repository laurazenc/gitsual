import Git from 'nodegit'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

import types from './index'
import ProjectManager from '../../../bin/ProjectManager'
import RepoBuilder from '../../../bin/RepoBuilder'
import { Theme } from 'src/bin/ThemeManager'

interface RepoAction extends Action<string> {
    type: string
    repo?: RepoBuilder
    error?: string | null
}

export type RepoActions = RepoAction

export const loadRepo: ActionCreator<ThunkAction<void, RepoBuilder, null, RepoAction>> = (
    repoName: string,
    theme: Theme,
) => {
    return async (dispatch: Dispatch) => {
        const openingRepoAction: RepoAction = {
            type: types.OPEN_REPO,
        }
        dispatch(openingRepoAction)

        try {
            const pManager = new ProjectManager()
            await pManager.initDatabase()
            const result = await pManager.getProject(repoName)

            if (!result) {
                const openingRepoFailAction: RepoAction = {
                    type: types.OPEN_REPO_FAIL,
                    error: `Repo ${repoName} not found`,
                }
                dispatch(openingRepoFailAction)
            }

            const dirPath = result.path
            const gitRepository: Git.Repository = await Git.Repository.open(dirPath)

            // build repo
            const repo: RepoBuilder = await RepoBuilder.create(gitRepository, repoName, theme)
            const openingRepoSuccessAction: RepoActions = {
                type: types.OPEN_REPO_SUCCESS,
                repo,
            }
            dispatch(openingRepoSuccessAction)
        } catch (error) {
            const openingRepoFailAction: RepoAction = {
                type: types.OPEN_REPO_FAIL,
                error,
            }
            dispatch(openingRepoFailAction)
        }
    }
}
