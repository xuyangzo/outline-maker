import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';

// database operations
import { createCharacter } from '../../../../db/operations/character-ops';

// type declaration
import { CharacterModalProps, CharacterModalState } from './characterModalDec';
import { DatabaseError } from 'sequelize';

class CharacterModal extends React.Component<CharacterModalProps, CharacterModalState> {
	constructor(props: CharacterModalProps) {
		super(props);
		this.state = {
			name: ''
		};
	}

	handleSubmit = () => {
		// novel_id, outline_id, name, color
		createCharacter(this.props.id, null, this.state.name, null)
			.then(() => {
				// alert success
				Message.success('人物创建成功！');
				// refresh character
				this.props.refreshCharacter(this.props.id);
				// close modal
				this.props.closeModal();
				// clear modal data
				this.setState({
					name: ''
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
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
					<Button
						type="primary"
						key="submit"
						onClick={this.handleSubmit}
						ghost
					>确认
					</Button>
				]}
			>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<Form.Item>
						<Input
							value={name}
							onChange={this.onChange}
							prefix={<Icon type="user-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="主角姓名（最多 20 个字）"
							ref={(input: Input) => input && input.focus()}
						/>
						更多的人设可以在添加角色后进行设置。
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default CharacterModal;
