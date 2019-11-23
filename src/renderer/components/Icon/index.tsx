import * as React from 'react'
import * as icons from './svgs'

interface IconProps {
	name: string,
	height?: string,
	width?: string,
	color?: string
}


const Icon = ({ name, ...rest }: IconProps) => {
	// @ts-ignore: Unreachable code error
	const Svg = icons.default[name]
	
	if (!Svg) {
		console.error(`${name} doesn't exist in the ICON namespace`) // eslint-disable-line
		return null
	}

	return <Svg {...rest} />
}

export default Icon