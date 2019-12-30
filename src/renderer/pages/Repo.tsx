/* eslint-disable no-debugger */
import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps } from 'react-router-dom'
import { AppState } from '../store/reducers'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import styled from 'styled-components'

import { loadRepo } from '../store/actions/repo'

import { Flex, Text, CommitList, Icon } from '../components'
import { Repository } from 'src/bin/RepoBuilder'

import { Theme } from 'src/bin/ThemeManager'

import {
    describeArc,
    describeInverseArc,
    describeInverseLeftArc,
    describeInverseRightArc,
    drawLine,
} from '../../bin/graph/utils'
import { Commit } from 'src/bin/graph/commit'

const RADIUS = 10
export const OFFSET_X = 2 * RADIUS
export const OFFSET_Y = 40
const LINE_WIDTH = 3
const INNER_RADIUS = RADIUS - LINE_WIDTH / 2

interface RepoProps {
    match: RouteComponentProps<any>
    loadRepo: (name: string, theme: Theme) => void
    repo: Repository | null | undefined
    isLoading: boolean
    theme: Theme
}

const Container = styled.div`
    height: 100%;
`

const TopBar = styled(Flex)`
    background-color: ${props => props.theme.colors.bar.top};
    height: ${props => props.theme.sizes.topBar};
`

const SideBar = styled(Flex)`
    height: 100%;
    background-color: ${props => props.theme.colors.bar.sidebar};
`

const Main = styled(Flex)`
    height: calc(100% - ${props => props.theme.sizes.topBar} - 1px);
    overflow: hidden;
    background-color: ${props => props.theme.colors.martinique};
`

const Wrapper = styled.div`
    width: 100%;
    height: inhetit;
    overflow: auto;
    display: flex;
    position: relative;
`

interface GraphProps {
    height: string
    width: string
}

const Graph = styled.div<GraphProps>`
    height: ${props => props.height};
    width: ${props => props.width};
    position: absolute;
    left: 24px;
    top: 24px;
`

const Repo: React.FC<RepoProps> = ({ match, loadRepo, repo, isLoading, theme }) => {
    const { params } = match as any
    const [offset] = useState(0)
    const [branches, setBranches] = useState({ localBranches: [], remoteBranches: [] })
    const [repository, setRepo] = useState()
    const graphRef = useRef()

    useEffect(() => {
        const load = async () => {
            await loadRepo(params.name, theme)
        }
        params.name && load()
    }, [params.name])

    useEffect(() => {
        if (!isLoading && repo) {
            setRepo(repo)
        }
    }, [repo])

    if (isLoading || !repository) return null

    const getBranchColor = (j: number, colorPalette = theme.colorPalette) => {
        return colorPalette[j % colorPalette.length]
    }
    const drawNodes = () => {
        const commitGraph = repository.graph
        // Draw only visible nodes
        const positions = commitGraph.commits.map((commit: Commit) => {
            const commitPosition = commitGraph.commitgraph.positions.get(commit.hash)!
            return { hash: commit.hash, i: commitPosition[0], j: commitPosition[1], type: commitPosition[2] }
        })

        const paths = []

        for (const position of positions) {
            const { hash, i, j, type } = position
            const [x, y] = computeNodeCenterCoordinates(i, j)

            paths.push(
                <g>
                    <circle id={hash} cx={x} cy={y} r={RADIUS} fill={getBranchColor(j)} />
                    <circle id={hash} cx={x} cy={y} r={RADIUS / 2} fill={theme.colors.martinique} />
                </g>,
            )
        }

        return paths
    }

    const computeNodeCenterCoordinates = (i: number, j: number) => {
        return [j * OFFSET_X + RADIUS, 3 + i * OFFSET_Y + RADIUS - offset]
    }

    const drawEdges = () => {
        const commitGraph = repository.graph.commitgraph
        const edges = commitGraph.edges

        const edgesPaths = []
        for (const [[i0, j0], [i1, j1], type] of edges.search(0, repository.graph.commits.length)) {
            const [x0, y0] = computeNodeCenterCoordinates(i0, j0)
            const [x1, y1] = computeNodeCenterCoordinates(i1, j1)

            let color

            if (j0 !== j1 && type === 'Merge') {
                color = getBranchColor(j1)
            } else {
                color = getBranchColor(j0)
            }

            const centerX = (x0 + x1) / 2
            const centerY = (y0 + y1) / 2

            const startAngle = Math.atan2(y0 - y1, x0 - x1),
                endAngle = Math.atan2(centerY - y1, centerX - x1)
            if (type === 'Merge') {
                // merge top left
                if (x1 > x0 && y1 > y0) {
                    edgesPaths.push(
                        <path
                            key={`n${edgesPaths.length}`}
                            d={describeArc(x1, y1, x0, y0, 10, startAngle, endAngle)}
                            fill="transparent"
                            stroke={color}
                            strokeWidth={LINE_WIDTH}
                        />,
                    )
                } else {
                    //merge top right bottom left
                    edgesPaths.push(
                        <path
                            key={`n${edgesPaths.length}`}
                            d={describeInverseRightArc(x0, y0, x1, y1, 10, startAngle, endAngle)}
                            fill="transparent"
                            stroke={color}
                            strokeWidth={LINE_WIDTH}
                        />,
                    )
                }
            } else {
                if (x1 === x0) {
                    // line
                    edgesPaths.push(
                        <path
                            key={`n${edgesPaths.length}`}
                            d={drawLine(x1, y1, x0, y0)}
                            fill="transparent"
                            stroke={color}
                            strokeWidth={LINE_WIDTH}
                        />,
                    )
                } else {
                    if (x0 < x1) {
                        // start branch top left bottom right
                        edgesPaths.push(
                            <path
                                key={`n${edgesPaths.length}`}
                                d={describeInverseLeftArc(x0, y0, x1, y1, 10, startAngle, endAngle)}
                                fill="transparent"
                                stroke={color}
                                strokeWidth={LINE_WIDTH}
                            />,
                        )
                    } else {
                        edgesPaths.push(
                            <path
                                key={`n${edgesPaths.length}`}
                                d={describeInverseArc(x0, y0, x1, y1, 10, startAngle, endAngle)}
                                fill="transparent"
                                stroke={color}
                                strokeWidth={LINE_WIDTH}
                            />,
                        )
                    }
                }
            }
        }
        return edgesPaths
    }

    const drawIndexNode = () => {
        // Draw the node
        const [x, y] = computeNodeCenterCoordinates(0, 0)
        return (
            <circle
                id="index-node"
                cx={x}
                cy={y}
                r={INNER_RADIUS}
                stroke={theme.colors.coal}
                strokeWidth={LINE_WIDTH + 2}
                fill={theme.colors.martinique}
            />
        )
    }

    const drawIndexEdge = () => {
        const commitGraph = repository.graph.commitgraph
        const repo = repository

        // Draw the edge between the index and the head commit
        if (repo.headCommit) {
            let [x0, y0] = computeNodeCenterCoordinates(0, 0) // eslint-disable-line
            y0 += RADIUS
            const node = commitGraph.positions.get(repo.headCommit.sha())!
            if (!node) {
                console.error(
                    `Unable to draw index edge: position of head is undefined.\n` +
                        `Heads's commit: ${repo.headCommit.sha()}.\n` +
                        `Heads's branch: ${repo.head ? repo.head.name() : ''}`,
                )
                return
            }
            const [x1, y1] = computeNodeCenterCoordinates(node[0], node[1])

            return (
                <path
                    key="index-edge"
                    d={drawLine(x1, y1, x0, y0)}
                    fill="transparent"
                    stroke={theme.colors.coal}
                    strokeWidth={LINE_WIDTH}
                />
            )
        }

        return null
    }

    const getLocalBranches = () => {
        branches.localBranches.map(branch => {
            return null
        })
    }

    return (
        <Container>
            <TopBar align="center" justify="flex-start" padding="0 24px">
                <Link to="/">
                    <Icon name="logo" height="25px" width="50px" color={theme.getRandomColor} />
                </Link>
                <Flex direction="column" width="auto" margin="0 20px 0">
                    <Text size="12px" color="light" height="16px" spacing="0.2px">
                        repository
                    </Text>
                    <Text size="16px" color="white" height="24px" spacing="0.1px">
                        {repository.name}
                    </Text>
                </Flex>
                <Flex direction="column" width="auto" margin="0 20px 0">
                    <Text size="12px" color="light" height="16px" spacing="0.2px">
                        branch
                    </Text>
                    <Text size="16px" color="white" height="24px" spacing="0.1px">
                        {repository.currentBranch.name()}
                    </Text>
                </Flex>
            </TopBar>
            <Main align="stretch" justify="flex-start">
                <SideBar padding="24px" direction="column" width="auto">
                    <Text size="18px" color="light" height="24px" transform="uppercase" weight="500" margin="0 0 24px">
                        local branches
                    </Text>
                    {getLocalBranches()}
                    <Text size="18px" color="light" height="24px" transform="uppercase" weight="500" margin="0 0 24px">
                        remote branches
                    </Text>
                    <Text size="18px" color="light" height="24px" transform="uppercase" weight="500" margin="0 0 24px">
                        stashes
                    </Text>
                    <Text size="18px" color="light" height="24px" transform="uppercase" weight="500" margin="0 0 24px">
                        tags
                    </Text>
                </SideBar>
                <Wrapper>
                    <Graph
                        height={`${repository.commits.length * OFFSET_Y + 30}px`}
                        width={`${repository.graph.commitgraph.width * (RADIUS * 2)}px`}
                    >
                        <svg>
                            {drawIndexNode()}
                            {drawIndexEdge()}
                            {drawEdges()}
                            {drawNodes()}
                        </svg>
                    </Graph>
                    <CommitList
                        shaToReferences={repository.shaToReferences}
                        commits={repository.commits}
                        graph={repository.graph.commitgraph}
                        graphSize={`${repository.graph.commitgraph.width * (RADIUS * 2)}`}
                        getBranchColor={getBranchColor}
                    />
                </Wrapper>
            </Main>
        </Container>
    )
}

const mapState = (state: AppState) => ({
    repo: state.repo.repo,
    isLoading: state.repo.isLoadingRepo,
    theme: state.theme.theme,
})

const mapDispatch = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    loadRepo: (repoName: string, theme: Theme) => dispatch(loadRepo(repoName, theme)),
})

export default connect(mapState, mapDispatch)(Repo)
