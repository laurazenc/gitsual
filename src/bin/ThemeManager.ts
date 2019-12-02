import { BrowserWindowConstructorOptions } from 'electron'
import { defaultTheme } from '../shared/theme'

export interface Theme {
    theme?: string
    colors: any
    fonts: any
    window: BrowserWindowConstructorOptions
}

class ThemeManager {
    public theme: string

    public colors: any

    public fonts: any

    public window: BrowserWindowConstructorOptions | {}

    constructor(theme?: string) {
        this.theme = theme || 'dark'
        this.window = {}
        this.colors = {}
        this.fonts = {}
    }

    async load() {
        this.window = defaultTheme.window
        this.colors = defaultTheme.colors
        this.fonts = defaultTheme.fonts
        return this
    }
}

export default ThemeManager
