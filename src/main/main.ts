import { app, BrowserWindow } from 'electron'
import url from 'url'
import path from 'path'

let win: BrowserWindow | null

const installExtensions = async () => {
	const installer = require('electron-devtools-installer')
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

	return Promise.all(
		extensions.map(name => installer.default(installer[name], forceDownload))
	).catch(console.log)
}

const createWindow = async () => {
	if (process.env.NODE_ENV !== 'production') {
		await installExtensions()
	}


	win = new BrowserWindow({
		show: false,
		width: 1024,
		height: 800
	})

	if (process.env.NODE_ENV !== 'production') {
		process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'
		win.loadURL(`http://localhost:2003`)
	} else {
		win.loadURL(
			url.format({
				pathname: path.join(__dirname, 'index.html'),
				protocol: 'file',
				slashes: true
			})
		)
	}

	win.webContents.on('did-finish-load', () => {
		if (!win) {
			throw new Error('"win" is not defined')
		}
		if (process.env.START_MINIMIZED) {
			win.minimize()
		} else {
			win.show()
			win.focus()
		}
	})



	if (process.env.NODE_ENV !== 'production') {
		// Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
		win.webContents.once('dom-ready', () => {
			win!.webContents.openDevTools()
		})
	}

	win.on('closed', () => {
		win = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})
