import Cog from './Cog'
import File from './File'
import Folder from './Folder'
import Heart from './Heart'
import Laptop from './Laptop'
import Logo from './Logo'
import Remote from './Remote'
import Clone from './Clone'

interface IconProps {
    color?: string
    width?: string
    height?: string
}

export default {
    logo: Logo,
    folder: Folder,
    laptop: Laptop,
    file: File,
    cog: Cog,
    heart: Heart,
    remote: Remote,
    clone: Clone,
}
export type IconType = IconProps
