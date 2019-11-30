import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';

// type declaration
import { CharacterModalProps, CharacterModalState, CharacterModalTemplate } from './characterModalDec';

class CharacterModal extends React.Component<CharacterModalProps, CharacterModalState> {
	private characterName = React.createRef<Modal>();

	constructor(props: CharacterModalProps) {
		super(props);
		this.state = {
			name: ''
		};
	}

	handleLocalSubmit = () => {
		// validation
		if (!this.state.name.length) {
			Message.error('角色姓名不能为空！');
			return;
		}
		if (this.state.name.length > 20) {
			Message.error('角色姓名长度不能超过 20 个字！');
			return;
		}

		this.props.createCharacterLocally(this.state.name);
		// close modal
		this.props.closeModal();
		// clear modal data
		this.setState({
			name: ''
		});
	}

	// on input change
	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const name = event.target.value;
		this.setState((prevState: CharacterModalState) => ({
			...prevState,
			name
		}));
	}

	// close current modal
	closeModal = () => {
		this.props.closeModal();
		// clear content
		this.setState({
			name: ''
		});
	}

	render() {
		const { showModal } = this.props;

		const { name } = this.state;

		return (
			<Modal
				title="新建角色"
				visible={showModal}
				onOk={this.handleLocalSubmit}
				onCancel={this.closeModal}
				footer={[
					<Button type="danger" key="back" onClick={this.closeModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						// onClick={this.handleSubmit}
						onClick={this.handleLocalSubmit}
						ghost
					>确认
					</Button>
				]}
				ref={this.characterName}
			>
				<Form onSubmit={this.handleLocalSubmit} className="login-form">
					<Form.Item>
						<Input
							value={name}
							onChange={this.onChange}
							prefix={<Icon type="user-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="主角姓名（最多 20 个字）"
						/>
						更多的人设可以在添加角色后进行设置。
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default CharacterModal;
