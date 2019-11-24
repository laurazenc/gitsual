import styled, { css, StyledFunction } from 'styled-components'

interface ButtonProps {
	border?: boolean
	borderColor?: string
	radius?: string
	padding?: string
	justify?: string
	align?: string
	margin?: string
}

const Button = styled.div<ButtonProps>`
    padding: ${props => props.padding || '0'};
    display: flex;
    justify-content: ${props => props.justify || 'center'};
    align-items: ${props => props.align || 'center'};
    margin: ${props => props.margin || '0'};

    ${props =>
		props.border &&
		css`
            border: 1px solid ${props.theme.colors[props.borderColor || 'border']};
        `}

    ${props =>
		props.radius &&
		css`
            border-radius: ${props.radius};
        `}
`

export default Button
