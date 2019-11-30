import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';

// type declaration
import { CharacterModalProps, CharacterModalState, CharacterModalTemplate } from './characterModalDec';
import { ValidationErrorItem } from 'sequelize';

// sequelize modals
import Character from '../../../../db/models/Character';

class CharacterModal extends React.Component<CharacterModalProps, CharacterModalState> {
	constructor(props: CharacterModalProps) {
		super(props);
		this.state = {
			name: ''
		};
	}

	handleSubmit = () => {
		// create outline
		Character
			.create({
				outline_id: this.props.id,
				name: this.state.name
			})
			.then(() => {
				Message.success('创建角色成功！');
				// close modal
				this.props.closeModal();
				// refresh main content
				this.props.refreshMain();
				// clear modal data
				this.setState({
					name: ''
				});
			})
			.catch(({ errors }: { errors: ValidationErrorItem[] }) => {
				// iterate through all error messages
				errors.forEach((error: ValidationErrorItem) => {
					const { message } = error;
					Message.error(message);
				});
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
				onOk={this.handleSubmit}
				onCancel={this.closeModal}
				footer={[
					<Button type="danger" key="back" onClick={this.closeModal} ghost>取消</Button>,
					<Button type="primary" key="submit" onClick={this.handleSubmit} ghost>确认</Button>
				]}
			>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<Form.Item>
						<Input
							value={name}
							onChange={this.onChange}
							prefix={<Icon type="user-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="主角姓名（最多 20 个字）"
						/>
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default CharacterModal;
