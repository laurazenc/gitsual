import React, { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    width: 160px;
    position: relative;
    height: 28px;
    display: flex;
    align-items: center;
`

const OverFlowWrapper = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    :hover {
        position: absolute;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        top: 0;
        left: 0;
        z-index: 2;
    }
`
const More = styled.div`
    background-color: ${props => props.theme.colors.coalBright};
    border-radius: 3px;
    height: 22px;
    color: ${props => props.theme.colors.white};
    line-height: 18px;
    font-size: 12px;
    margin-left: 8px;
    padding: 4px;
`

interface BranchHolderProps {
    branches: Set<string, any>
}

const BranchHolder = ({ branches }: BranchHolderProps) => {
    const [shownBranches, setBranches] = useState<BranchHolderProps>(branches[0])
    const [showMore, setShowMore] = useState(true)

    const onOver = () => {
        setShowMore(false)
        setBranches(branches)
    }

    const onOut = () => {
        setShowMore(true)
        setBranches(branches[0])
    }

    const drawMore = () => {
        return showMore && branches.length > 1 ? <More>+{branches.length - 1}</More> : null
    }

    return (
        <Wrapper>
            {branches.length === 1 ? (
                branches
            ) : (
                <>
                    <OverFlowWrapper onMouseOver={onOver} onMouseOut={onOut}>
                        {shownBranches}
                    </OverFlowWrapper>
                    {drawMore()}
                </>
            )}
        </Wrapper>
    )
}

export default BranchHolder
