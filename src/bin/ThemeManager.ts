import { defaultTheme } from '../shared/theme'

import { BrowserWindowConstructorOptions } from 'electron'

export interface Theme {
	theme: string
	colors: object
	fonts: object
	window: BrowserWindowConstructorOptions
}

class ThemeManager {
	public theme: string
	public colors: object
	public fonts: object
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