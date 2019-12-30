import React from 'react'
import styled from 'styled-components'

import { Svg } from './shared'

interface CloneProps {
    color?: string
    width?: string
    height?: string
}

const Clone = ({ color, width = '20', height = '20' }: CloneProps) => {
    return (
        <Svg
            width={width}
            height={height}
            color={color}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16.6666 1.66667H3.33329C2.41282 1.66667 1.66663 2.41286 1.66663 3.33334V6.66667C1.66663 7.58715 2.41282 8.33334 3.33329 8.33334H16.6666C17.5871 8.33334 18.3333 7.58715 18.3333 6.66667V3.33334C18.3333 2.41286 17.5871 1.66667 16.6666 1.66667Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.6666 11.6667H3.33329C2.41282 11.6667 1.66663 12.4129 1.66663 13.3333V16.6667C1.66663 17.5871 2.41282 18.3333 3.33329 18.3333H16.6666C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V13.3333C18.3333 12.4129 17.5871 11.6667 16.6666 11.6667Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M5 5H5.00833" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15H5.00833" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    )
}

export default Clone
export type CloneType = CloneProps
