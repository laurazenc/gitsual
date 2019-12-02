import styled from 'styled-components'

export const Svg = styled.svg`
    path {
        fill: ${props => props.theme.colors[props.color || 'white']};
    }
`
