import styled, { StyledFunction, css } from 'styled-components'

interface TextProps {
	font?: string
	size?: string
	height?: string
	color?: string
	margin?: string
	padding?: string
}

const Text = styled.div<TextProps>`
    white-space: pre;
    font-family: ${props => props.theme.fonts[props.font || 'poppins']};
    font-size: ${props => props.size || '12px'};
    line-height: ${props => props.height || '20px'};
    color: ${props => props.theme.colors[props.color || 'text']};
    padding: ${props => props.padding || '0'};

    ${props => props.margin && css`
        margin: ${props.margin};
    `}
`


export default Text