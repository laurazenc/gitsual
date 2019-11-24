import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'

let win: BrowserWindow | null

const installExtensions = async () => {
	const installer = require('electron-devtools-installer')
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

	return Promise.all(
		extensions.map(name => installer.default(installer[name], forceDownload))
	).catch(console.log) // eslint-disable-line
}

const createWindow = async () => {
	if (process.env.NODE_ENV !== 'production') {
		await installExtensions()
	}


	win = new BrowserWindow({
		show: false,
		width: 1024,
		height: 800,
		webPreferences: {
			nodeIntegration: true
		}
	})

	if (process.env.NODE_ENV !== 'production') {
		process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1' // eslint-disable-line
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