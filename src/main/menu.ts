import { BrowserWindow, ipcMain } from 'electron';

import { resetDatabase } from './utils/db';
// import { redirectToLanding } from './utils/redirect';

// modals
// const openNotification = require('./modals/notification').openNotification;
// import * as notification from './modals/notifications';
// const { notifyResetDB } = notification;

// custom menu
const template: (win: BrowserWindow | null) => Electron.MenuItemConstructorOptions[] = (win: BrowserWindow | null) => {
	return [
		{
			label: ''
		},
		{
			label: '编辑',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				{ role: 'delete' },
				{
					label: '刷新页面',
					accelerator: 'CmdOrCtrl+R',
					click() {
						(win || { reload: () => { } }).reload();
					}
				},
				{
					label: '重置数据',
					click() {
						// send request to confirm reset DB
						if (win) {
							win.webContents.send('askResetDB', '');
						}
					}
				}
			]
		}
	];
};

export default template;
