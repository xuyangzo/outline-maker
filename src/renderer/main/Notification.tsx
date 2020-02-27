import * as React from 'react';
import { notification, Modal, Button } from 'antd';
const { ipcRenderer } = require('electron');

// type declaration
import { NotificationProps } from './notificationDec';

// enable history
import { withRouter } from 'react-router-dom';

const Notification = (props: NotificationProps) => {
	const { refreshSidebar } = props;
	const [showResetModal, setResetModal] = React.useState<boolean>(false);

	React.useEffect(() => {
		// listen to message from main process
		ipcRenderer.on('askResetDB', onResetDB);
		// reset database
		ipcRenderer.on('resetDB', resetDB);

		// cleanup
		return function cleanup() {
			ipcRenderer.removeListener('askResetDB', onResetDB);
			ipcRenderer.removeListener('resetDB', resetDB);
		};
	});

	// open reset modal
	function onResetDB() {
		setResetModal(true);
	}

	// confirm reset db
	function onConfirmResetDB() {
		// send message to main process
		ipcRenderer.send('shouldResetDB', 'should resetDB');
		// close modal
		setResetModal(false);
	}

	// when reset database
	function resetDB() {
		// show notification
		notification['success']({
			message: '重置数据成功！',
			description: '您现在已经一无所有了~'
		});
		// refresh sidebar
		refreshSidebar();
		// redirect to tutorial page
		props.history.push('/');
	}

	return (
		<React.Fragment>
			<Modal
				title="重置数据"
				visible={showResetModal}
				onOk={onConfirmResetDB}
				onCancel={() => setResetModal(false)}
				footer={[
					<Button type="danger" key="back" onClick={() => setResetModal(false)} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onConfirmResetDB}
						ghost
					>确认
					</Button>
				]}
			>
				数据重置后无法恢复！<br />
				请谨慎选择是否重置！
			</Modal>
		</React.Fragment>
	);
};

export default withRouter(Notification);
