import React from 'react'
import { Svg } from './shared'


interface FolderProps {
	color?: string
	width?: string
	height?: string
}


const Folder = ({ color, width = '16', height = '16' }: FolderProps) => {
	return (
		<Svg width={width} height={height} color={color} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/Svg">
			<g id="folder-opened">
				<path id="icon" fillRule="evenodd" clipRule="evenodd" d="M12.6666 3.33333C13.403 3.33333 14 3.93029 14 4.66667V5.33333C14.7363 5.33333 15.3333 5.93029 15.3333 6.66667L15.3174 6.81129L13.9973 12.7519C13.9533 13.4486 13.3744 14 12.6666 14H1.99996C1.26358 14 0.666626 13.403 0.666626 12.6667V3.33333C0.666626 2.59695 1.26358 2 1.99996 2H5.99996C6.74663 2 7.22192 2.31697 7.69928 2.91924C7.71247 2.93589 7.74462 2.97731 7.78022 3.02319L7.78034 3.02335L7.78042 3.02345C7.83071 3.08826 7.88785 3.16189 7.90828 3.18721C7.92894 3.21283 7.94637 3.23402 7.96076 3.25153L7.96077 3.25154C8.01941 3.32285 8.02791 3.33319 8.00115 3.33333H12.6666ZM12.6666 4.66667V5.33333H3.33329C2.55556 5.33333 2.20676 5.74764 2.01938 6.50694L1.99996 6.59431V3.33333H5.99996C6.25612 3.33333 6.40464 3.43238 6.65436 3.74744C6.66221 3.75734 6.68471 3.78634 6.71274 3.82248C6.76633 3.89156 6.84014 3.9867 6.87051 4.02436C7.20575 4.43994 7.51762 4.66409 7.99639 4.66666L12.6666 4.66667ZM12.6666 12.6667H2.01622L3.31741 6.81129C3.33323 6.74753 3.34707 6.6997 3.35749 6.66667H13.9837L12.6825 12.522L12.6666 12.6667Z" fill={color} />
			</g>
		</Svg>
	)
}

export default Folder

export type FolderType = FolderProps