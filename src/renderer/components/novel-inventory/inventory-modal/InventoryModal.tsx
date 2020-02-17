import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message, Select } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

// database operations
import { createInventory } from '../../../../db/operations/inventory-ops';

// type declaration
import { InventoryModalProps } from './inventoryModalDec';

// utils
import { inventoryCategories } from '../../../utils/constants';

const InventoryModal = (props: InventoryModalProps) => {
	const { showModal, novel_id, closeModal, refreshInventory } = props;
	// hooks
	const [name, setName] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');
	const [category, setCategory] = React.useState<string>('');
	const [image, setImage] = React.useState<string>('');

	// on input change
	function onChange(event: React.ChangeEvent<HTMLInputElement>) {
		const name = event.target.value;
		setName(name);
	}

	// the event of textarea change is different, so use a separate method
	function onTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		const description = event.target.value;
		setDescription(description);
	}

	// close current modal
	function onCloseModal() {
		closeModal();
		// clear content
		setName('');
		setDescription('');
		setCategory('');
	}

	// create new inventory
	function handleSubmit() {
		const props = {
			name,
			description,
			image,
			novel_id,
			category
		};

		createInventory(props)
			.then(() => {
				// alert success
				Message.success('道具创建成功！');
				// refresh inventory
				refreshInventory();
				// close modal and clear input
				onCloseModal();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Modal
			title="新建道具"
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
						placeholder="道具名字（最多 20 个字）"
						ref={(input: Input) => input && input.focus()}
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
				<Form.Item>
					<Select defaultValue="lucy" style={{ width: 200 }} onChange={(val: string) => setCategory(val)}>
						{
							inventoryCategories.map((inventory: string) => (
								<Option value={inventory} key={inventory}>{inventory}</Option>
							))
						}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default InventoryModal;
