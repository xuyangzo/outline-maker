import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';

// database operations
import { createCharacter } from '../../../../db/operations/character-ops';

// type declaration
import { CharacterModelProps } from './characterModelDec';
import { DatabaseError } from 'sequelize';

const CharacterModal = (props: CharacterModelProps) => {
	const { showModal, novel_id, closeModal, refreshCharacter } = props;
	// hooks
	const [name, setName] = React.useState<string>('');

	// on input change
	function onChange(event: React.ChangeEvent<HTMLInputElement>) {
		const name = event.target.value;
		setName(name);
	}

	// close current modal
	function onCloseModal() {
		closeModal();
		// clear content
		setName('');
	}

	// create new character
	function handleSubmit() {
		createCharacter({ name, novel_id })
			.then(() => {
				// alert success
				Message.success('人物创建成功！');
				// refresh character
				refreshCharacter();
				// close modal and clear input
				onCloseModal();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Modal
			title="新建角色"
			visible={showModal}
			onOk={handleSubmit}
			onCancel={closeModal}
			footer={[
				<Button type="danger" key="back" onClick={closeModal} ghost>取消</Button>,
				<Button
					type="primary"
					key="submit"
					onClick={handleSubmit}
					ghost
				>确认
				</Button>
			]}
		>
			<Form onSubmit={handleSubmit} className="login-form">
				<Form.Item>
					<Input
						value={name}
						onChange={onChange}
						prefix={<Icon type="user-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="角色姓名（最多 20 个字）"
						ref={(input: Input) => input && input.focus()}
					/>
					更多的人设可以在添加角色后进行设置。
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CharacterModal;
