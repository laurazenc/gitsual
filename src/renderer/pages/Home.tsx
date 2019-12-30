import * as React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import styled from 'styled-components'
import { AnyAction } from 'redux'
import { Link } from 'react-router-dom'

import { Button, Flex, Icon, Text } from '../components'
import { AppState } from '../store/reducers'
import { Project } from '../store/reducers/projects'
import { openProject, loadProjects } from '../store/actions/projects'
import { Theme } from 'src/bin/ThemeManager'

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
    theme: Theme
}

const Home: React.FC<HomeProps> = ({ theme, recentProjects, loadProjects, openProject }) => {
    const open = async () => {
        await openProject()
        await loadProjects()
    }

    return (
        <FlexContainer justify="space-between" align="center" direction="column" padding="16px">
            <Flex direction="column" align="center" justify="center" maxWidth="700px" style={{ height: '100%' }}>
                <Icon name="logo" color={theme.getRandomColor} />
                <Text size="44px" weight="500" height="54px" margin="30px 0">
                    Welcome to gitsual
                </Text>
                <Flex justify="space-between" margin="100px 0 0">
                    <Panel>
                        <Button justify="flex-start" margin="0 0 10px 0" padding="6px 8px" onClick={() => open()}>
                            <Icon name="folder" color="white" width="20" height="20" />
                            <Text size="14px" height="18px" margin="0 0 0 8px" weight="500">
                                Open existing repo
                            </Text>
                        </Button>
                        <Button border={true} justify="flex-start" margin="0 0 10px 0" padding="6px 8px">
                            <Icon name="clone" color="white" width="20" height="20" />
                            <Text size="14px" height="18px" margin="0 0 0 8px" weight="500">
                                Clone repository
                            </Text>
                        </Button>
                        <Button border={true} justify="flex-start" padding="6px 8px">
                            <Icon name="file" color="white" width="20" height="20" />
                            <Text size="14px" height="18px" margin="0 0 0 8px" weight="500">
                                Start new repo
                            </Text>
                        </Button>
                    </Panel>
                    {recentProjects.length > 0 && (
                        <Panel>
                            <Text
                                weight="500"
                                size="20px"
                                height="26px"
                                color="light"
                                transform="uppercase"
                                margin="0 0 16px 0"
                            >
                                Recent
                            </Text>
                            {recentProjects.map((project: Project, i: number) => {
                                return (
                                    <Flex key={i} maxWidth="250px" align="center">
                                        <Link to={`/repo/${project.name}`}>
                                            <Text
                                                size="13x"
                                                height="16px"
                                                margin="0 8px 0 0"
                                                color="link"
                                                decoration="none"
                                                weight="500"
                                            >
                                                {project.name}
                                            </Text>
                                        </Link>
                                        <Path size="16px" height="24px" spacing="0.1" color="white">
                                            {project.path}
                                        </Path>
                                    </Flex>
                                )
                            })}
                        </Panel>
                    )}
                    <Panel>
                        <Text
                            weight="500"
                            size="20px"
                            height="26px"
                            color="light"
                            transform="uppercase"
                            margin="0 0 16px 0"
                        >
                            Customize
                        </Text>
                        <Flex align="center">
                            <Icon name="cog" color={theme.colors.text} width="24" height="24" />
                            <Text size="16px" height="24px" color="white" margin="0 0 0 8px">
                                Preferences
                            </Text>
                        </Flex>
                    </Panel>
                </Flex>
            </Flex>
            <Flex justify="center">
                <Text size="12px" height="16px" weight="500" color="text">
                    Made with{' '}
                </Text>
                <Icon name="heart" color="red" />
                <Text size="12px" height="16px" weight="500" color="text">
                    {' '}
                    by{' '}
                </Text>
                <Text size="12px" height="16px" weight="500" color="link">
                    [at]laurazenc
                </Text>
            </Flex>
        </FlexContainer>
    )
}

const mapState = (state: AppState) => ({
    recentProjects: state.projects.projects,
    theme: state.theme.theme,
})

const mapDispatch = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    openProject: () => dispatch(openProject()),
    loadProjects: () => dispatch(loadProjects()),
})

export default connect(mapState, mapDispatch)(Home)
