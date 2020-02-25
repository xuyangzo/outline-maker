import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message, Select, Upload } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

// file stream
const fs = require('fs');

// database operations
import { createInventory, InventoryTemplate } from '../../../../db/operations/inventory-ops';
import { getAllCharactersGivenNovel } from '../../../../db/operations/character-ops';

// type declaration
import { InventoryModalProps } from './inventoryModalDec';
import { NovelCharacterDataValues, NovelCharacterDataValue } from '../../novel-character/novelCharacterDec';

// utils
import { inventoryCategories } from '../../../utils/constants';

const InventoryModal = (props: InventoryModalProps) => {
	const { showModal, novel_id, closeModal, refreshInventory } = props;
	// hooks
	const [name, setName] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');
	const [category, setCategory] = React.useState<string>('');
	const [characters, setCharacters] = React.useState<NovelCharacterDataValue[]>([]);
	const [masters, setMasters] = React.useState<string[]>([]);
	const [image, setImage] = React.useState<string>('');

	React.useEffect(getCharacters, [novel_id]);

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
		setMasters([]);
		setImage('');
	}

	// on image upload
	function onImageUpload(file: any) {
		const { path, type } = file;

		// check if file type is image
		if (type.indexOf('image') === -1) {
			Message.error('只能选择图片！');
			return false;
		}

		// read file based on system path
		fs.readFile(path, (err: any, data: any) => {
			// if cannot read the image
			if (err) {
				Message.error('无法读取图片！');
				return false;
			}

			// convert buffer to base64 string format
			const imageStr: string = `data:${type};base64,${Buffer.from(data).toString('base64')}`;
			setImage(imageStr);
			return false;
		});

		return false;
	}

	// get all valid characters
	function getCharacters() {
		getAllCharactersGivenNovel(novel_id)
			.then((result: NovelCharacterDataValues) => {
				const { main, sub } = result;
				setCharacters(main.concat(sub));
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// when select masters
	function onSelectCharacter(masters: string[]) {
		setMasters(masters);
		console.log(masters);
	}

	// create new inventory
	function handleSubmit() {
		const props: InventoryTemplate = {
			name,
			image,
			novel_id,
			category,
			masters
		};

		if (description) props.description = description;

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
					/>
				</Form.Item>
				<Form.Item>
					<TextArea
						value={description}
						onChange={onTextAreaChange}
						autoSize={
							{ minRows: 6, maxRows: 6 }
						}
						placeholder="简单描述，不超过200字"
					/>
				</Form.Item>
				<Form.Item>
					分类：
					<Select defaultValue="法宝" style={{ width: '80%' }} onChange={(val: string) => setCategory(val)}>
						{
							inventoryCategories.map((inventory: string) => (
								<Option value={inventory} key={inventory}>{inventory}</Option>
							))
						}
					</Select>
				</Form.Item>
				<Form.Item>
					主人：
					<Select
						mode="multiple"
						style={{ width: '80%' }}
						placeholder="选择道具所属的主人"
						onChange={onSelectCharacter}
						value={masters}
					>
						{
							characters.map((character: NovelCharacterDataValue) => (
								<Option key={character.id}>{character.name}</Option>
							))
						}
					</Select>
				</Form.Item>
				<Form.Item>
					<Upload
						name="profile-image"
						customRequest={onImageUpload}
						beforeUpload={onImageUpload}
						style={{ width: '100%' }}
					>
						<Button>
							<Icon type="upload" /> 选择图片
								</Button>
					</Upload>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default InventoryModal;
