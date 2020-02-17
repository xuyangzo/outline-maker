import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';
const { TextArea } = Input;

// type declaration
import { OutlineModalProps, OutlineModalTemplate } from './outlineModalDec';

// database operations
import { createOutline } from '../../../../db/operations/outline-ops';

const OutlineModal = (props: OutlineModalProps) => {
	const { showModal, novel_id, closeModal, refreshOutline } = props;
	// hooks
	const [title, setTitle] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');

	// when input field changes
	function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const title = event.target.value;
		setTitle(title);
	}

	// the event of textarea change is different, so use a separate method
	function onTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		const description = event.target.value;
		setDescription(description);
	}

	// close modal
	function onCloseModal() {
		closeModal();
		// clear content
		setTitle('');
		setDescription('');
	}

	function handleSubmit() {
		/**
		 * if the user does not enter anything for description
		 * do not include it in the object (otherwise it will be empty string)
		 * so that the defaultValue of sequelize modal will be used
		 */
		const model: OutlineModalTemplate = { title, novel_id };
		if (description.length) {
			model.description = description;
		}

		// create outline
		createOutline(model)
			.then(() => {
				// alert success
				Message.success('创建大纲成功！');
				// refresh outlines
				refreshOutline();
				// close modal and clear modal data
				onCloseModal();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Modal
			title="创建新的大纲"
			visible={showModal}
			onOk={handleSubmit}
			onCancel={onCloseModal}
			footer={[
				<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
				<Button type="primary" key="submit" onClick={handleSubmit} ghost>确认</Button>
			]}
		>
			<Form onSubmit={handleSubmit} className="login-form">
				<Form.Item>
					<Input
						value={title}
						onChange={onInputChange}
						prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="大纲名字（10个字以内）"
						autoFocus
					/>
				</Form.Item>
				<Form.Item>
					<TextArea
						value={description}
						onChange={onTextAreaChange}
						autoSize={
							{ minRows: 6, maxRows: 6 }
						}
						placeholder="简单描述，不超过100字"
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default OutlineModal;
