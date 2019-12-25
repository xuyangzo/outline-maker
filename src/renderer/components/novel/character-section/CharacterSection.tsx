import * as React from 'react';
import { Col, message as Message, Card, Row, Icon, Modal, Button, Checkbox } from 'antd';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { CharacterSectionProps } from './characterSectionDec';
import { Character } from '../../character/characterDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// database operations
import { deleteCharacterTemp } from '../../../../db/operations/character-ops';

const CharacterSection = (props: CharacterSectionProps) => {
	const { characters, novel_id, onCreateCharacter, refreshCharacter, isEdit } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [checkedList, setCheckedList] = React.useState<string[]>([]);
	React.useEffect(
		() => {
			if (props.batchDelete) {
				if (checkedList.length) {
					Promise
						.all(checkedList.map((id: string) => deleteCharacterTemp(id)))
						.then(() => {
							Message.success('选中的角色已经被删除！');
							refreshCharacter(novel_id);
						})
						.catch((err: DatabaseError) => {
							Message.error(err.message);
						});
				}
			}
		},
		[props.batchDelete]
	);

	// open modal
	function onOpenModal(e: React.MouseEvent, id: string | number) {
		// prevent bubbling
		e.preventDefault();

		// set selected
		setShowModal(true);
		setSelected(id);
	}

	// close modal
	function onCloseModal() {
		setSelected('');
		setShowModal(false);
	}

	// delete character
	function onDeleteCharacter() {
		// delete character temporarily
		deleteCharacterTemp(selected)
			.then(() => {
				// alert success
				Message.success('删除角色成功！');
				// close modal
				onCloseModal();
				// refresh characters
				refreshCharacter(novel_id);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	function onCheckboxChange(e: CheckboxChangeEvent) {
		const id: string = e.target.name || '';
		const checked: boolean = e.target.checked;

		// push id to checked list
		if (checked) setCheckedList(checkedList.concat(id));
		else setCheckedList(checkedList.filter((checked: string) => checked !== id));
	}

	// when check all checkbox changes
	function onCheckAllChange(e: CheckboxChangeEvent) {
		const checked: boolean = e.target.checked;
		// check all checkbox
		if (checked) setCheckedList(characters.map((character: Character) => character.id.toString()));
		// uncheck all checkbox
		else setCheckedList([]);
	}

	return (
		<Row>
			{
				isEdit && (
					<Checkbox
						indeterminate={checkedList.length > 0 && checkedList.length < characters.length}
						onChange={onCheckAllChange}
						checked={checkedList.length === characters.length}
						className="check-all-box"
					>
						角色全选
					</Checkbox>
				)
			}
			{
				characters.map((character: Character) => (
					<Col span={6} key={character.id} className="card-container">
						{
							isEdit && (
								<div className="card-edit-cover">
									<Checkbox
										className="custom-checkbox"
										onChange={onCheckboxChange}
										name={character.id.toString()}
										checked={checkedList.indexOf(character.id.toString()) !== -1}
									/>
								</div>
							)
						}
						<div
							className="delete-icon"
							onClick={(e: React.MouseEvent) => onOpenModal(e, character.id)}
						>
							<Icon type="close" />
						</div>
						<Card
							title={character.name}
							bordered={false}
							hoverable
							className="custom-card"
							onClick={() => {
								props.history.push(`/character/${novel_id}/${character.id}`);
							}}
						>
							<img src={character.image} alt="图片自爆了" />
						</Card>
					</Col>
				))
			}
			{
				!characters.length && (
					<Col span={6}>
						<Card
							title="还没有角色哦..."
							bordered={false}
							hoverable
							className="custom-card add-character-card"
							onClick={onCreateCharacter}
						>
							<Icon type="user-add" /> 新建角色
						</Card>
					</Col>
				)
			}
			<Modal
				title="删除角色"
				visible={showModal}
				onOk={onDeleteCharacter}
				onCancel={onCloseModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteCharacter}
						ghost
					>确认
					</Button>
				]}
			>
				角色删除后可以在垃圾箱里恢复！
			</Modal>
		</Row>
	);
};

export default withRouter(CharacterSection);
