import React from 'react'
import styled from 'styled-components'

import Git from 'nodegit'

import Branch from './Branch'
import BranchHolder from './BranchHolder'
import { CommitGraph } from 'src/bin/graph/commit-graph'

const Commit = styled.div`
    display: flex;
    color: white;
    font-family: 'Poppins';
    min-height: 28px;
    margin-left: 0;
    margin-bottom: 12px;
    align-items: end;
`

const Message = styled.div`
    padding-left: 8px;
    position: relative;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.2px;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 28px;
        background-color: ${props => props.color};
    }
`

interface ListProps {
    readonly graphSize: string
}

const List = styled.div<ListProps>`
    margin-top: 24px;
    padding-left: ${props => parseInt(props.graphSize) + 32}px;
`

interface BranchType {
    isLocal: boolean
    isRemote: boolean
}

interface CommitListProps {
    commits: Git.Commit[]
    graph: CommitGraph
    graphSize: string
    getBranchColor: Function
    shaToReferences: any
}

const CommitList: React.SFC<CommitListProps> = ({ commits, graph, graphSize, getBranchColor, shaToReferences }) => {
    const getBranches = (color: string, references: string[]) => {
        const branches: JSX.Element[] = []
        const populatedReferences: Map<string, BranchType> = new Map()

        references.map((reference: string, i: number) => {
            const isLocalBranch = reference.includes('refs/heads/')
            const isRemoteBranch = reference.includes('refs/remotes/')

            const branchName = reference.replace('refs/heads/', '').replace('refs/remotes/origin/', '')
            const existingBranch = populatedReferences.get(branchName)
            const branchInfo = existingBranch ? existingBranch : { isLocal: false, isRemote: false }
            if (isLocalBranch) branchInfo.isLocal = true
            if (isRemoteBranch) branchInfo.isRemote = true

            if (branchName !== '') populatedReferences.set(branchName, branchInfo)
        })

        for (const [branchName, info] of populatedReferences) {
            branches.push(<Branch key={branchName} {...{ color, info, branchName }} />)
        }

        return branches
    }

    const getCommits = () => {
        const items: JSX.Element[] = []
        items.push(
            <Commit {...{ color: getBranchColor(0) }}>
                <BranchHolder branches={[]} />
                <Message {...{ color: getBranchColor(0) }}> hey </Message>
            </Commit>,
        )

        items.push(
            ...commits.map((commit: Git.Commit) => {
                const commitSha = commit.sha()
                const color = getBranchColor(graph.positions.get(commitSha)![1])
                const references = shaToReferences.get(commitSha) || ['']
                return (
                    <Commit key={commitSha} {...{ color }}>
                        <BranchHolder branches={getBranches(color, references)} />
                        <Message {...{ color }}> {commit.summary()} </Message>
                    </Commit>
                )
            }),
        )
        return items
    }

    return <List {...{ graphSize }}> {getCommits()} </List>
}

export default CommitList
