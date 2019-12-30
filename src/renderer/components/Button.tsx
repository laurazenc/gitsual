import styled, { css, StyledFunction } from 'styled-components'

interface ButtonProps {
    border?: boolean
    borderColor?: string
    padding?: string
    justify?: string
    align?: string
    margin?: string
    height?: string
}

const Button = styled.div<ButtonProps>`
    height: ${props => props.height || '40px'}
    padding: ${props => props.padding || '0'};
    display: flex;
    justify-content: ${props => props.justify || 'center'};
    align-items: ${props => props.align || 'center'};
    margin: ${props => props.margin || '0'};
    background-color: ${props => props.theme && props.theme.colors.button.default};
    border-radius: 4px;


    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme && props.theme.colors.button.active};
    }

`

export default Button
