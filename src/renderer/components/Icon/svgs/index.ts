import Cog, { CogType } from './Cog'
import File, { FileType } from './File'
import Folder, { FolderType } from './Folder'
import Heart, { HeartType } from './Heart'
import Laptop, { LaptopType } from './Laptop'
import Logo, { LogoType } from './Logo'

interface IconProps {
    color?: string
    width?: string
    height?: string
}

export default { logo: Logo, folder: Folder, laptop: Laptop, file: File, cog: Cog, heart: Heart }
export type IconType = IconProps
