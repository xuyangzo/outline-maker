import * as React from 'react';
import { Modal, Button } from 'antd';

// type declaration
import { GuardProps } from './guardDec';

// enable history
import { withRouter } from 'react-router-dom';

const Guard = (props: GuardProps) => {
	const { openGuard, redirectUrl, setClose, setSave } = props;

	// redirect
	function redirect() {
		// close modal
		setClose();
		// redirect
		props.history.push(redirectUrl);
		// set edited to false
		setSave();
	}

	return (
		<React.Fragment>
			<Modal
				title="未保存的内容"
				visible={openGuard}
				onOk={redirect}
				onCancel={setClose}
				footer={[
					<Button type="primary" key="back" onClick={setClose} ghost>取消</Button>,
					<Button
						type="danger"
						key="submit"
						onClick={redirect}
						ghost
					>丢弃并跳转
					</Button>
				]}
			>
				当前页面存在着未保存的内容！<br />
				是否继续跳转？（未保存的改变会被丢弃！）
			</Modal>
		</React.Fragment>
	);
};

export default withRouter(Guard);
