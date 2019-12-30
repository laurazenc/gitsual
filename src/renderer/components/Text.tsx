import styled, { css, StyledFunction } from 'styled-components'

interface TextProps {
    font?: string
    size?: string
    height?: string
    color?: string
    margin?: string
    padding?: string
    transform?: string
    decoration?: string
    weight?: string
    spacing?: string
}

const Text = styled.div<TextProps>`
    white-space: pre;
    font-family: ${props => props.theme.fonts[props.font || 'poppins']};
    font-size: ${props => props.size || '12px'};
    line-height: ${props => props.height || '20px'};
    color: ${props => props.theme.colors[props.color || 'text']};
    padding: ${props => props.padding || '0'};
    text-decoration: ${props => props.decoration || 'none'};
    text-transform: ${props => props.transform || 'none'};
    font-weight: ${props => props.weight || 'normal'}
        ${props =>
            props.margin &&
            css`
                margin: ${props.margin};
            `};

    letter-spacing: ${props => props.spacing || '1'};
`

export default Text
