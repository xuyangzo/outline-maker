const url = require('url');
const path = require('path');

// install extensions
export const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

	return Promise.all(
		extensions.map(name => installer.default(installer[name], forceDownload))
	).catch(console.log);
};

// redirect to landing page
export const redirectToLanding = (win: any) => {
	if (win) {
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
	}
};
