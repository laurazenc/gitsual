import Logo, { LogoType } from './Logo'
import Folder, { FolderType } from './Folder'
import Laptop, { LaptopType } from './Laptop'
import File, { FileType } from './File'
import Cog, { CogType } from './Cog'
import Heart, { HeartType } from './Heart'

interface IconProps {
	color?: string
	width?: string
	height?: string
}

export default { logo: Logo, folder: Folder, laptop: Laptop, file: File, cog: Cog, heart: Heart }
export type IconType = IconProps
