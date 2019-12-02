import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { loadProjects } from '../../../src/renderer/store/actions/projects'

import types from '../../../src/renderer/store/actions'
import { initialState } from '../../../src/renderer/store/reducers/projects'

jest.unmock('../../../src/bin/ProjectManager')
import ProjectManager from '../../../src/bin/ProjectManager'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Project actions', () => {
    it('returns LOAD_PROJECTS_SUCCESS when loading projects', async () => {
        const mockDb = () => {
            return { db: { get: () => ({ value: jest.fn() }) } }
        }

        // @ts-ignore
        ProjectManager.prototype.initDatabase = mockDb

        const expectedActions = [{ type: types.LOAD_PROJECTS }, { type: types.LOAD_PROJECTS_SUCCESS, projects: [] }]
        const store = mockStore(initialState)
        await store.dispatch(loadProjects() as any)
        expect(store.getActions()).toEqual(expectedActions)
    })
})
