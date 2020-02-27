import { app, BrowserWindow, nativeImage, shell, Menu, ipcMain } from 'electron';
const contextMenu = require('electron-context-menu');
import { resetDatabase } from './utils/db';
import { redirectToLanding, installExtensions } from './utils/installations';

// templates
import menuTemplate from './menu';
import contextTemplate from './context';

let win: BrowserWindow | null;

// add right click property
contextMenu(contextTemplate);

const createWindow = async () => {
	// install extensions
	if (process.env.NODE_ENV !== 'production') {
		await installExtensions();
	}

	// create new window
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

	// if dev mode, open dev tools
	if (process.env.NODE_ENV !== 'production') {
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
