import * as React from 'react';
import { notification } from 'antd';
const { ipcRenderer } = require('electron');

// type declaration
import { NotificationProps } from './notificationDec';

// enable history
import { withRouter } from 'react-router-dom';

const Notification = (props: NotificationProps) => {
	const { refreshSidebar } = props;

	React.useEffect(() => {
		// listen to message from main process
		ipcRenderer.on('resetDB', resetDB);

		// cleanup
		return function cleanup() {
			ipcRenderer.removeListener('resetDB', resetDB);
		};
	});

	// when reset database
	function resetDB() {
		// show notification
		notification.open({
			message: '重置数据成功！',
			description: '您现在已经一无所有了~'
		});
		// refresh sidebar
		refreshSidebar();
		// redirect to tutorial page
		props.history.push('/');
	}

	return (
		<div />
	);
};

export default withRouter(Notification);
