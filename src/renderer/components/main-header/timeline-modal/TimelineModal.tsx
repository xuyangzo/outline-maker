import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';

// type declaration
import { TimelineModalProps, TimelineModalState } from './timelineModalDec';

class TimelineModal extends React.Component<TimelineModalProps, TimelineModalState> {
	constructor(props: TimelineModalProps) {
		super(props);
		this.state = {
			time: ''
		};
	}

	handleLocalSubmit = () => {
		// validation
		if (!this.state.time.length) {
			Message.error('时间线不能为空！');
			return;
		}
		if (this.state.time.length > 20) {
			Message.error('时间线长度不能超过 20 个字！');
			return;
		}

		this.props.createTimelineLocally(this.state.time);
		// close modal
		this.props.closeModal();
		// clear modal data
		this.setState({
			time: ''
		});
	}

	// on input change
	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const time = event.target.value;
		this.setState((prevState: TimelineModalState) => ({
			...prevState,
			time
		}));
	}

	// close current modal
	closeModal = () => {
		this.props.closeModal();
		// clear content
		this.setState({
			time: ''
		});
	}

	render() {
		const { showModal } = this.props;
		const { time } = this.state;

		return (
			<Modal
				title="新建时间线"
				visible={showModal}
				onOk={this.handleLocalSubmit}
				onCancel={this.closeModal}
				footer={[
					<Button type="danger" key="back" onClick={this.closeModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={this.handleLocalSubmit}
						ghost
					>确认
					</Button>
				]}
			>
				<Form onSubmit={this.handleLocalSubmit} className="login-form">
					<Form.Item>
						<Input
							value={time}
							onChange={this.onChange}
							prefix={<Icon type="user-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="时间线（最多 20 个字）"
							ref={(input: Input) => input && input.focus()}
						/>
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default TimelineModal;
