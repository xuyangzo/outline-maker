import { app, BrowserWindow, nativeImage } from 'electron';
const contextMenu = require('electron-context-menu');
const mypath = require('path');

import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow | null;

// add right click property
contextMenu({
	prepend: (defaultActions: any, params: any, browserWindow: any) => [
		{
			label: 'Rainbow',
			// Only show it when right-clicking images
			visible: params.mediaType === 'image'
		},
		{
			label: '添加到收藏',
			visible: params.selectionText.trim().length > 0,
			click: () => { console.log(params); }
		}
	],
	labels: {
		cut: '剪切',
		copy: '复制',
		paste: '粘贴',
		save: 'Custom Save Image Text',
		saveImageAs: 'Custom Save Image As… Text',
		copyLink: 'Custom Copy Link Text',
		copyImageAddress: 'Custom Copy Image Address Text',
		inspect: 'inspect！！！'
	}
});

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

	return Promise.all(
		extensions.map(name => installer.default(installer[name], forceDownload))
	).catch(console.log);
};

const createWindow = async () => {
	if (process.env.NODE_ENV !== 'production') {
		await installExtensions();
	}

	console.log(mypath.join(__dirname, '../src/public/icons/mac/icon-512@2x.icns'));
	win = new BrowserWindow({
		width: 1200,
		height: 800,
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		},
		icon: mypath.join(__dirname, '../src/public/icons/mac/icon-512@2x.icns')
	});

	if (process.env.NODE_ENV !== 'production') {
		process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';
		win.loadURL('http://localhost:2003');
	} else {
		win.loadURL(
			url.format({
				pathname: path.join(__dirname, 'index.html'),
				protocol: 'file:',
				slashes: true
			})
		);
	}

	if (process.env.NODE_ENV !== 'production') {
		// Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
		win.webContents.once('dom-ready', () => {
			win!.webContents.openDevTools();
		});
	}

	win.on('closed', () => {
		win = null;
	});
};

app.on('ready', createWindow);

const image = nativeImage.createFromPath(
	app.getAppPath().concat('/src/public/icons/mac/icon-512@2x.icns')
);
app.dock.setIcon(image);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});
