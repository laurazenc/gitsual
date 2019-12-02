import styled, { css } from 'styled-components'

export const DIRECTION = ['row', 'column']
export const JUSTIFY = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']
export const ALIGN = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline']

interface FlexProps {
    direction?: string
    justify?: string
    align?: string
    margin?: string
    padding?: string
    background?: string
    flex?: string
    maxWidth?: string
}

const Flex = styled.div<FlexProps>`
    display: flex;
    flex-direction: ${props => props.direction};
    justify-content: ${props => props.justify};
    align-items: ${props => props.align};
    padding: ${props => props.padding};
    margin: ${props => props.margin};
    flex: ${props => props.flex};
    background-color: ${props => props.background};
    width: 100%;

    ${props =>
        props.flex &&
        css`
            flex: ${props.flex};
        `}

    ${props =>
        props.maxWidth &&
        css`
            max-width: ${props.maxWidth};
        `}
`

export default Flex
