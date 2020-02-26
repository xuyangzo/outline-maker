const url = require('url');
const path = require('path');

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
