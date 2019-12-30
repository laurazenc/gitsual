import * as React from 'react'
import { Svg } from './shared'

interface RemoteProps {
    color?: string
    width?: string
    height?: string
}

const Remote = ({ color, width = '24', height = '23' }: RemoteProps) => {
    return (
        <Svg
            width={width}
            height={height}
            color={color}
            viewBox="0 0 24 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0)">
                <path
                    d="M16 15.3333L12 11.5L8 15.3333"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M12 11.5V20.125" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                    d="M20.39 17.6238C21.3653 17.1142 22.1358 16.3079 22.5798 15.332C23.0239 14.3562 23.1162 13.2665 22.8422 12.2348C22.5682 11.2031 21.9434 10.2882 21.0666 9.63458C20.1898 8.98093 19.1108 8.62573 18 8.62503H16.74C16.4373 7.50305 15.8731 6.46143 15.0899 5.57848C14.3067 4.69552 13.3248 3.99422 12.2181 3.52727C11.1113 3.06033 9.90851 2.83991 8.70008 2.88258C7.49164 2.92525 6.30903 3.2299 5.24114 3.77362C4.17325 4.31735 3.24787 5.086 2.53458 6.02179C1.82129 6.95758 1.33865 8.03616 1.12294 9.17644C0.90723 10.3167 0.964065 11.489 1.28917 12.6052C1.61428 13.7214 2.1992 14.7525 2.99996 15.6209"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 15.3333L12 11.5L8 15.3333"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0">
                    <path d="M0 0H24V23H0V0Z" fill="white" />
                </clipPath>
            </defs>
        </Svg>
    )
}

export default Remote
export type RemoteType = RemoteProps
