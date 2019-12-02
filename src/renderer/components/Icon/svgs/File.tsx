import * as React from 'react'
import { Svg } from './shared'

interface FileProps {
    color?: string
    width?: string
    height?: string
}

const File = ({ color, width = '16', height = '16' }: FileProps) => {
    return (
        <Svg
            width={width}
            height={height}
            color={color}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="file">
                <path
                    id="icon"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.66667 1.99999H3.33333V14H10V15.3333H3.33333C2.59695 15.3333 2 14.7364 2 14V1.99999C2 1.26361 2.59695 0.666656 3.33333 0.666656H10.2761L14 4.39051V9.33332H12.6667V5.99999H10C9.26362 5.99999 8.66667 5.40304 8.66667 4.66666V1.99999ZM12.6667 12.6667V11.3333H14V12.6667H15.3333V14H14V15.3333H12.6667V14H11.3333V12.6667H12.6667ZM10 2.27613L12.3905 4.66666H10V2.27613Z"
                    fill={color}
                />
            </g>
        </Svg>
    )
}

export default File
export type FileType = FileProps
