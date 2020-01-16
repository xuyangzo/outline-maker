import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';

// database operations
import { createLocation } from '../../../../db/operations/location-ops';

// type declaration
import { LocationModalProps } from './locationModalDec';
import { DatabaseError } from 'sequelize';

const LocationModal = (props: LocationModalProps) => {
	const { showModal, novel_id, closeModal, refreshLocation } = props;
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

	// create new location
	function handleSubmit() {
		createLocation({ name, novel_id })
			.then(() => {
				// alert success
				Message.success('势力创建成功！');
				// refresh location
				refreshLocation();
				// close modal and clear input
				onCloseModal();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Modal
			title="新建势力"
			visible={showModal}
			onOk={handleSubmit}
			onCancel={onCloseModal}
			footer={[
				<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
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
						placeholder="势力名字（最多 20 个字）"
						ref={(input: Input) => input && input.focus()}
					/>
					更多的势力设定可以在添加势力后进行设置。
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default LocationModal;
