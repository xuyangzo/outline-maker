import { app, BrowserWindow, nativeImage, shell, Menu, ipcMain } from 'electron';
const contextMenu = require('electron-context-menu');

import * as path from 'path';
import * as url from 'url';
import { resetDatabase } from './utils/db';
import { redirectToLanding } from './utils/redirect';
import menuTemplate from './menu';

// modals
// const openNotification = require('./modals/notification').openNotification;
import * as notification from './modals/notifications';
const { notifyResetDB } = notification;

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
	},
	// TODO should disable this in production mode
	showInspectElement: true
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

	win = new BrowserWindow({
		width: 1200,
		height: 800,
		resizable: false,
		// frame: false, // remove native titlebar
		// titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: true
		},
		icon: 'src/public/icons/mac/icon-512@2x.icns'
	});

	// redirect to landing page
	redirectToLanding(win);

	if (process.env.NODE_ENV !== 'production') {
		// Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
		win.webContents.once('dom-ready', () => {
			win!.webContents.openDevTools();
		});
	}

	// set menu
	const template: Electron.MenuItemConstructorOptions[] = menuTemplate(win);
	Menu.setApplicationMenu(Menu.buildFromTemplate(template));

	win.on('closed', () => {
		win = null;
	});
};

app.on('ready', createWindow);

// const image = nativeImage.createFromPath(
// 	app.getAppPath().concat('/src/public/icons/mac/icon-512@2x.icns')
// );
// app.dock.setIcon(image);

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

// should reset DB
ipcMain.on('shouldResetDB', () => {
	resetDatabase()
		.then(() => {
			if (win) {
				win.webContents.send('resetDB', 'success!');
			}
		})
		.catch((err: Error) => {
			console.error(err.message);
		});
});
