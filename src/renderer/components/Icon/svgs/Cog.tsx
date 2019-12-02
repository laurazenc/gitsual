import React from 'react'
import styled from 'styled-components'

import { Svg } from './shared'

interface CogProps {
    color?: string
    width?: string
    height?: string
}

const Cog = ({ color, width = '16', height = '16' }: CogProps) => {
    return (
        <Svg
            width={width}
            height={height}
            color={color}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="cog">
                <path
                    id="icon"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.95125 12.0488L5.07422 15.0635L8.00001 13.7258L10.9258 15.0635L12.0488 12.0488L15.0635 10.9258L13.7258 8L15.0635 5.07421L12.0488 3.95124L10.9258 0.936508L8.00001 2.27418L5.07422 0.936508L3.95125 3.95124L0.936523 5.07421L2.2742 8L0.936523 10.9258L3.95125 12.0488ZM10.1767 13.2549L8.00001 12.2597L5.82336 13.2549L4.98792 11.0121L2.74511 10.1767L3.74027 8L2.74511 5.82335L4.98792 4.98791L5.82336 2.7451L8.00001 3.74026L10.1767 2.7451L11.0121 4.98791L13.2549 5.82335L12.2597 8L13.2549 10.1767L11.0121 11.0121L10.1767 13.2549ZM8.00002 11.3333C6.15907 11.3333 4.66669 9.84095 4.66669 8C4.66669 6.15905 6.15907 4.66667 8.00002 4.66667C9.84097 4.66667 11.3334 6.15905 11.3334 8C11.3334 9.84095 9.84097 11.3333 8.00002 11.3333ZM10 8C10 9.10457 9.10459 10 8.00002 10C6.89545 10 6.00002 9.10457 6.00002 8C6.00002 6.89543 6.89545 6 8.00002 6C9.10459 6 10 6.89543 10 8Z"
                    fill={color}
                />
            </g>
        </Svg>
    )
}

export default Cog
export type CogType = CogProps
