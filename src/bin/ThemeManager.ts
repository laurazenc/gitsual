import { BrowserWindowConstructorOptions } from 'electron'

import { defaultTheme } from '../shared/theme'

export interface Theme {
    name: string
    colors: any
    fonts: any
    branch: any
    commit: any
    colorPalette: any
    window: BrowserWindowConstructorOptions
    getRandomColor?: any
    sizes: any
}

class ThemeManager {
    public name: string

    public colors: any
    public fonts: any

    public branch: any
    public commit: any
    public colorPalette: string[]

    public window: BrowserWindowConstructorOptions | {}
    public sizes: any

    constructor(theme: Theme) {
        this.name = theme.name
        this.window = theme.window
        this.colors = theme.colors
        this.fonts = theme.fonts
        this.branch = theme.branch
        this.commit = theme.commit
        this.colorPalette = theme.colorPalette
        this.window = theme.window
        this.sizes = theme.sizes
    }

    load() {
        this.name = defaultTheme.name
        this.window = defaultTheme.window
        this.colors = defaultTheme.colors
        this.fonts = defaultTheme.fonts
        this.branch = defaultTheme.branch
        this.commit = defaultTheme.commit
        this.colorPalette = defaultTheme.colorPalette
        return this
    }

    public get getRandomColor() {
        return this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)]
    }
}

export default ThemeManager
