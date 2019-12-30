import React from 'react'
import styled from 'styled-components'

import Icon from './Icon'

const Tag = styled.div`
    position: relative;
    max-width: 150px;
    margin: 4px 0;
`

const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-content: center;
    background-color: ${props => props.color};
    border-radius: 3px;
    padding: 4px 2px;
    line-height: 20px;
`

const Name = styled.div`
    color: black;
    text-transform: uppercase;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.6;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 110px;
    overflow: hidden;
    margin-right: 4px;
`

const IconHolder = styled.div`
    height: 16px;
    width: 16px;
    :not(:last-of-type) {
        margin-right: 6px;
    }
`

const Branch = ({ color, branchName, info }) => {
    return (
        <Tag>
            <Wrapper color={color}>
                <Name title={branchName}>{branchName} </Name>
                <div style={{ display: 'flex' }}>
                    {info.isLocal && (
                        <IconHolder title="local">
                            <Icon width="16" height="16" name="laptop" color="black" />
                        </IconHolder>
                    )}
                    {info.isRemote && (
                        <IconHolder title="remote">
                            <Icon width="16" height="16" name="remote" color="black" />
                        </IconHolder>
                    )}
                </div>
            </Wrapper>
        </Tag>
    )
}

export default Branch
