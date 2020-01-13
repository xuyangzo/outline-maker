import * as React from 'react';
import { Col, message as Message, Card, Row, Icon, Modal, Button, Checkbox } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { OutlineSectionProps } from './outlineSectionDec';
import { Outline } from '../../sidebar/sidebarDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// database operations
import { deleteOutlineTemp, updateOutline } from '../../../../db/operations/outline-ops';

const OutlineSection = (props: OutlineSectionProps) => {
	const { outlines, novel_id, onCreateOutline, refreshOutline, isEdit, batchDelete, save } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [checkedList, setCheckedList] = React.useState<string[]>([]);
	const [changedOutlines, setOutlines] = React.useState<Outline[]>(outlines);

	React.useEffect(
		() => {
			if (batchDelete) {
				if (checkedList.length) {
					Promise
						.all(checkedList.map((id: string) => deleteOutlineTemp(id)))
						.then(() => {
							Message.success('选中的大纲已经被删除！');
							refreshOutline(novel_id);
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
					const promises: Promise<any>[] = changedOutlines.map((outline: Outline, index: number) => {
						return updateOutline(outline.id, { novelPageOrder: index + 1 });
					});

					Promise
						.all(promises)
						.then(() => {
							refreshOutline(novel_id);
						})
						.catch((err: DatabaseError) => {
							Message.error(err.message);
						});
				}
			}

			// refresh outlines
			setOutlines(outlines);
		},
		[props.batchDelete, props.outlines, props.save, props.isEdit]
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

	// delete outline
	function onDeleteOutline() {
		// delete outline temporarily (can be recovered from trash)
		deleteOutlineTemp(selected)
			.then(() => {
				// alert success
				Message.success('删除大纲成功！');
				// close modal
				onCloseModal();
				// refresh locations
				refreshOutline(novel_id);
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
		if (checked) setCheckedList(outlines.map((outline: Outline) => outline.id.toString()));
		// uncheck all checkbox
		else setCheckedList([]);
	}

	// when reorder finishes triggering
	function onSortEnd({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
		setOutlines(arrayMove(changedOutlines, oldIndex, newIndex));
	}

	// single item (card)
	const SortableItem = SortableElement(({ value }: { value: Outline }) => (
		<li className="card-li">
			<div key={value.id} className="card-container">
				<div className="card-edit-cover">
					<Checkbox
						className="custom-checkbox"
						onChange={onCheckboxChange}
						name={value.id.toString()}
						checked={checkedList.indexOf(value.id.toString()) !== -1}
					/>
				</div>
				<Card
					title={value.title}
					bordered={false}
					hoverable
					className="novel-custom-card outline-card"
					onClick={() => {
						props.history.push(`/outline/${novel_id}/${value.id}`);
					}}
				>
					<p>{value.description}</p>
				</Card>
			</div>
		</li>
	));

	// list of cards
	const SortableList = SortableContainer(({ items }: { items: Outline[] }) => {
		return (
			<ul>
				{items.map((value: Outline, index: number) => (
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
					outlines.map((outline: Outline) => (
						<Col span={6} key={outline.id} className="card-container">
							<div
								className="delete-icon"
								onClick={(e: React.MouseEvent) => onOpenModal(e, outline.id)}
							>
								<Icon type="close" />
							</div>
							<Card
								title={outline.title}
								bordered={false}
								hoverable
								className="novel-custom-card outline-card"
								onClick={() => {
									props.history.push(`/outline/${novel_id}/${outline.id}`);
								}}
							>
								<p>{outline.description}</p>
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
				<Checkbox
					indeterminate={checkedList.length > 0 && checkedList.length < outlines.length}
					onChange={onCheckAllChange}
					checked={checkedList.length === outlines.length}
					className="check-all-box"
				>
					大纲全选
				</Checkbox>
				<SortableList axis="xy" items={changedOutlines} onSortEnd={onSortEnd} />
			</div>
		);
	}

	return (
		<Row>
			{
				isEdit ? editJSX() : nonEditJSX()
			}
			{
				!outlines.length && (
					<Col span={6}>
						<Card
							title="还没有大纲哦..."
							bordered={false}
							hoverable
							className="novel-custom-card add-character-card"
							onClick={onCreateOutline}
						>
							<Icon type="file-add" /> 新建大纲
						</Card>
					</Col>
				)
			}
			<Modal
				title="删除大纲"
				visible={showModal}
				onOk={onDeleteOutline}
				onCancel={onCloseModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteOutline}
						ghost
					>确认
					</Button>
				]}
			>
				大纲删除后可以去垃圾箱恢复！是否继续？
			</Modal>
		</Row>
	);
};

export default withRouter(OutlineSection);
