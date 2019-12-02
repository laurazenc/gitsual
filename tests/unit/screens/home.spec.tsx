import React from 'react'
import { render, wait } from '../../../src/utils/test-helper'

import Home from '../../../src/renderer/pages/Home'

describe('Home screen', () => {
    test('should render', () => {
        const { container } = render(<Home />)
        expect(container).toMatchSnapshot()
    })

    test('should not render the recent projects columns if there is no loaded project ', async () => {
        const { queryAllByText } = render(<Home />)
        const column = await wait(() => queryAllByText('Recent'))
        expect(column).toBeUndefined()
    })

    test('should render the recent projects columns', async () => {
        const { queryAllByText } = render(<Home />, {
            mocked: true,
            customState: { projects: { projects: [{ name: 'wadus', path: 'path' }] } },
        })

        const [projectName] = queryAllByText('wadus')
        expect(projectName).toBeDefined()
    })
})
