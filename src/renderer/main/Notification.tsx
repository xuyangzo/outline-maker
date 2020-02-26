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
		ipcRenderer.on('resetDB', onResetDB);

		// cleanup
		return function cleanup() {
			ipcRenderer.removeListener('resetDB', onResetDB);
		};
	});

	// open reset modal
	function onResetDB() {
		setResetModal(true);
	}

	// when reset database
	function resetDB() {
		// show notification
		notification['success']({
			message: '重置数据成功！',
			description: '您现在已经一无所有了~'
		});
		// close modal
		setResetModal(false);
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
				onOk={resetDB}
				onCancel={() => setResetModal(false)}
				footer={[
					<Button type="danger" key="back" onClick={() => setResetModal(false)} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={resetDB}
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
