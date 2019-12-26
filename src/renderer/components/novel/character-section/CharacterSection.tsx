import * as React from 'react';
import { Col, message as Message, Card, Row, Icon, Modal, Button, Checkbox } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { CharacterSectionProps } from './characterSectionDec';
import { Character } from '../../character/characterDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// database operations
import { deleteCharacterTemp, updateCharacter } from '../../../../db/operations/character-ops';

const CharacterSection = (props: CharacterSectionProps) => {
	const { characters, novel_id, onCreateCharacter, refreshCharacter, isEdit, batchDelete, save } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [checkedList, setCheckedList] = React.useState<string[]>([]);
	const [changedCharacters, setCharacters] = React.useState<Character[]>(characters);
	React.useEffect(
		() => {
			// batch deletion
			if (batchDelete) {
				if (checkedList.length) {
					Promise
						.all(checkedList.map((id: string) => deleteCharacterTemp(id)))
						.then(() => {
							Message.success('选中的角色已经被删除！');
							refreshCharacter(novel_id);
							// clear checked list
							setCheckedList([]);
						})
						.catch((err: DatabaseError) => {
							Message.error(err.message);
						});
				}
			} else if (save) {
				// save order change
				if (save) {
					const promises: Promise<any>[] = changedCharacters.map((character: Character, index: number) => {
						return updateCharacter(character.id, { novelPageOrder: index + 1 });
					});

					Promise
						.all(promises)
						.then(() => {
							refreshCharacter(novel_id);
						})
						.catch((err: DatabaseError) => {
							Message.error(err.message);
						});
				}
			}

			// reset characters
			setCharacters(characters);
		},
		[props.batchDelete, props.characters, props.save]
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

	// when single card's checkbox changed
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

	// when reorder finishes triggering
	function onSortEnd({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
		// swap order of two elements
		setCharacters(arrayMove(changedCharacters, oldIndex, newIndex));
	}

	// single item (card)
	const SortableItem = SortableElement(({ value }: { value: Character }) => (
		<li className="card-li">
			<div key={value.id} className="card-container">
				{
					isEdit && (
						<div className="card-edit-cover">
							<Checkbox
								className="custom-checkbox"
								onChange={onCheckboxChange}
								name={value.id.toString()}
								checked={checkedList.indexOf(value.id.toString()) !== -1}
							/>
						</div>
					)
				}
				<div
					className="delete-icon"
					onClick={(e: React.MouseEvent) => onOpenModal(e, value.id)}
				>
					<Icon type="close" />
				</div>
				<Card
					title={value.name}
					bordered={false}
					hoverable
					className="novel-custom-card"
					onClick={() => {
						props.history.push(`/value/${novel_id}/${value.id}`);
					}}
				>
					<img src={value.image} alt="图片自爆了" />
				</Card>
			</div>
		</li>
	));

	// list of cards
	const SortableList = SortableContainer(({ items }: { items: Character[] }) => {
		return (
			<ul>
				{items.map((value: Character, index: number) => (
					<SortableItem key={value.id} index={index} value={value} />
				))}
			</ul>
		);
	});

	// jsx under non-edit mode
	function nonEditJSX(): React.ReactElement {
		return (
			<div>
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
								className="novel-custom-card"
								onClick={() => {
									props.history.push(`/character/${novel_id}/${character.id}`);
								}}
							>
								<img src={character.image} alt="图片自爆了" />
							</Card>
						</Col>
					))
				}
			</div>
		);
	}

	// jsx under edit mode
	function editJSX(): React.ReactElement {
		return (
			<div>
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
				<SortableList axis="xy" items={changedCharacters} onSortEnd={onSortEnd} />
			</div>
		);
	}

	return (
		<Row>
			{
				isEdit ? editJSX() : nonEditJSX()
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
