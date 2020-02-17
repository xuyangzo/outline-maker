import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message, Select } from 'antd';
const { Option } = Select;

// type declaration
import { CharacterModalProps, CharacterModalState, CharacterMainDataValue } from './characterModalDec';

// database operations
import { getAllValidCharacters } from '../../../../db/operations/character-ops';

class CharacterModal extends React.Component<CharacterModalProps, CharacterModalState> {
	constructor(props: CharacterModalProps) {
		super(props);
		this.state = {
			name: '',
			characters: [],
			selectedCharacter: ''
		};
	}

	componentDidMount = () => {
		getAllValidCharacters(this.props.novel_id, this.props.outline_id)
			.then((characters: CharacterMainDataValue[]) => {
				// set characters
				this.setState({ characters });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	handleLocalSubmit = () => {
		const { selectedCharacter } = this.state;
		/**
		 * if selected character is not empty
		 * set the character to be selected character
		 */
		if (selectedCharacter) {
			this.props.importCharacterLocally(selectedCharacter);
			// close modal
			this.props.closeModal();
			// clear modal data
			this.setState({ name: '', selectedCharacter: '' });
			return;
		}

		// validation
		if (!this.state.name.length) {
			Message.error('角色姓名不能为空！');
			return;
		}
		if (this.state.name.length > 20) {
			Message.error('角色姓名长度不能超过 20 个字！');
			return;
		}

		// create character locally
		this.props.createCharacterLocally(this.state.name);
		// close modal
		this.props.closeModal();
		// clear modal data
		this.setState({ name: '' });
	}

	// on input change
	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const name = event.target.value;
		this.setState({ name });
	}

	// when select character
	onSelectCharacter = (value: string) => {
		this.setState({ selectedCharacter: value });
	}

	// close current modal
	closeModal = () => {
		this.props.closeModal();
		// clear content
		this.setState({ name: '' });
	}

	render() {
		const { showModal } = this.props;
		const { name, characters, selectedCharacter } = this.state;

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
						onClick={this.handleLocalSubmit}
						ghost
					>确认
					</Button>
				]}
			>
				<Form onSubmit={this.handleLocalSubmit} className="login-form">
					<Form.Item>
						<Input
							value={name}
							onChange={this.onChange}
							prefix={<Icon type="user-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="主角姓名（最多 20 个字）"
							ref={(input: Input) => input && input.focus()}
							disabled={selectedCharacter !== ''}
						/>
						更多的人设可以在添加角色后进行设置。
					</Form.Item>
					<Form.Item>
						或者，从已经创建的人物中选择：<br />
						<Select defaultValue="" style={{ width: 200 }} onChange={this.onSelectCharacter}>
							<Option value="">无</Option>
							{
								characters.map((character: CharacterMainDataValue) => (
									<Option value={character.id} key={character.id}>{character.name}</Option>
								))
							}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default CharacterModal;
