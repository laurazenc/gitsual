import * as React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import styled from 'styled-components'
import { AnyAction } from 'redux'
import { Link } from 'react-router-dom'

import { Button, Flex, Icon, Text } from '../components'
import { AppState } from '../store/reducers'
import { Project } from '../store/reducers/projects'
import { openProject, loadProjects, ProjectActions } from '../store/actions/projects'

const FlexContainer = styled(Flex)`
    height: 100%;
`

const Path = styled(Text)`
    text-overflow: ellipsis;
    overflow: hidden;
`

const Panel = styled.div``

interface HomeProps {
    openProject: () => void
    loadProjects: () => void
    recentProjects: Project[] | any
}

const Home: React.FC<HomeProps> = ({ recentProjects, loadProjects, openProject }) => {
    const open = async () => {
        await openProject()
        await loadProjects()
    }

    return (
        <FlexContainer justify="space-between" align="center" direction="column" padding="16px">
            <Flex direction="column" align="center" justify="center" maxWidth="700px" style={{ height: '100%' }}>
                <Icon name="logo" />
                <Text size="21px" height="30px" margin="30px 0">
                    Welcome to gitsual
                </Text>
                <Flex justify="space-between" margin="100px 0 0">
                    <Panel>
                        <Button
                            border={true}
                            radius="3px"
                            justify="flex-start"
                            margin="0 0 10px 0"
                            padding="6px 12px"
                            onClick={() => open()}
                        >
                            <Icon name="folder" color="accent" />
                            <Text size="16px" height="24px" margin="0 0 0 10px">
                                Open existing repo
                            </Text>
                        </Button>
                        <Button border={true} radius="3px" justify="flex-start" margin="0 0 10px 0" padding="6px 12px">
                            <Icon name="laptop" color="accent" />
                            <Text size="16px" height="24px" margin="0 0 0 10px">
                                Clone repository
                            </Text>
                        </Button>
                        <Button border={true} radius="3px" justify="flex-start" padding="6px 12px">
                            <Icon name="file" color="accent" />
                            <Text size="16px" height="24px" margin="0 0 0 10px">
                                Start new repo
                            </Text>
                        </Button>
                    </Panel>
                    {recentProjects.length > 0 && (
                        <Panel>
                            <Text size="20px" height="30px" margin="0 0 16px 0">
                                Recent
                            </Text>
                            {recentProjects.map((project: Project, i: number) => {
                                return (
                                    <Flex key={i} maxWidth="250px">
                                        <Link to={`/repo/${project.name}`}>
                                            <Text size="16px" height="24px" margin="0 12px 0 0" color="accent">
                                                {project.name}
                                            </Text>
                                        </Link>
                                        <Path size="16px" height="24px" color="light">
                                            {project.path}
                                        </Path>
                                    </Flex>
                                )
                            })}
                        </Panel>
                    )}
                    <Panel>
                        <Text size="20px" height="30px" margin="0 0 16px 0">
                            Customize
                        </Text>
                        <Flex align="center">
                            <Icon name="cog" />
                            <Text size="16px" height="24px" color="accent" margin="0 0 0 10px">
                                Preferences
                            </Text>
                        </Flex>
                    </Panel>
                </Flex>
            </Flex>
            <Flex justify="center">
                <Text size="12px" height="16px">
                    Made with{' '}
                </Text>
                <Icon name="heart" color="red" />
                <Text size="12px" height="16px">
                    {' '}
                    by{' '}
                </Text>
                <Text size="12px" height="16px" color="accent">
                    @laurazenc
                </Text>
            </Flex>
        </FlexContainer>
    )
}

const mapState = (state: AppState) => ({
    recentProjects: state.projects.projects,
})

const mapDispatch = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    openProject: () => dispatch(openProject()),
    loadProjects: () => dispatch(loadProjects()),
})

export default connect(mapState, mapDispatch)(Home)
