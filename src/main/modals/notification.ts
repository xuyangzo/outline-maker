const { BrowserWindow } = require('electron');
const ipc = require('electron').ipcRenderer;

const url = require('url');
const path = require('path');

let newWindow: any = null;

// open notification
const openNotification = () => {
	if (newWindow) {
		newWindow.focus();
		return;
	}

	newWindow = new BrowserWindow({
		height: 185,
		resizable: false,
		width: 270,
		title: '',
		minimizable: false,
		fullscreenable: false
	});

	// check whether production mode or development mode
	if (process.env.NODE_ENV !== 'production') {
		process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';
		newWindow.loadURL('http://localhost:2003/notification');
	} else {
		newWindow.loadURL(
			url.format({
				pathname: path.join(__dirname, 'notification'),
				protocol: 'file:',
				slashes: true
			})
		);
	}

	newWindow.on('closed', () => {
		newWindow = null;
	});
};

export { openNotification };
