import * as React from 'react'
import { Svg } from './shared'

interface LaptopProps {
    color?: string
    width?: string
    height?: string
}

const Laptop = ({ color, width = '16', height = '16' }: LaptopProps) => {
    return (
        <Svg
            width={width}
            height={height}
            color={color}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="laptop">
                <path
                    id="icon"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.6666 2.66667H3.33329C2.59691 2.66667 1.99996 3.26363 1.99996 4.00001V10H0.666626V12C0.666626 12.7364 1.26358 13.3333 1.99996 13.3333H14C14.7363 13.3333 15.3333 12.7364 15.3333 12V10H14V4.00001C14 3.26363 13.403 2.66667 12.6666 2.66667ZM12.6666 10H3.33329V4.00001H12.6666V10ZM1.99996 12V11.3333H14V12H1.99996Z"
                    fill={color}
                />
            </g>
        </Svg>
    )
}

export default Laptop
export type LaptopType = LaptopProps
