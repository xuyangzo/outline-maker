import * as React from 'react';
import { Col, message as Message, Card, Row, Icon, Modal, Button, Checkbox } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { LocationSectionProps } from './locationSectionDec';
import { Location } from '../../location/locationDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// database operations
import { deleteLocationTemp, updateLocation } from '../../../../db/operations/location-ops';

// image
import unknownArea from '../../../../public/unknown_gray.jpg';

const LocationSection = (props: LocationSectionProps) => {
	const { locations, novel_id, onCreateLocation, refreshLocation, isEdit, batchDelete, save } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [checkedList, setCheckedList] = React.useState<string[]>([]);
	const [changedLocations, setLocations] = React.useState<Location[]>(locations);
	React.useEffect(
		() => {
			if (batchDelete) {
				if (checkedList.length) {
					Promise
						.all(checkedList.map((id: string) => deleteLocationTemp(id)))
						.then(() => {
							Message.success('选中的势力已经被删除！');
							refreshLocation(novel_id);
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
					const promises: Promise<any>[] = changedLocations.map((location: Location, index: number) => {
						return updateLocation(location.id, { novelPageOrder: index + 1 });
					});

					Promise
						.all(promises)
						.then(() => {
							refreshLocation(novel_id);
						})
						.catch((err: DatabaseError) => {
							Message.error(err.message);
						});
				}
			}

			// refresh locations
			setLocations(locations);
		},
		[props.batchDelete, props.locations, props.save]
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

	// delete location
	function onDeleteLocation() {
		// delete location temporarily
		deleteLocationTemp(selected)
			.then(() => {
				// alert success
				Message.success('删除势力成功！');
				// close modal
				onCloseModal();
				// refresh locations
				refreshLocation(novel_id);
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
		if (checked) setCheckedList(locations.map((location: Location) => location.id.toString()));
		// uncheck all checkbox
		else setCheckedList([]);
	}

	// when reorder finishes triggering
	function onSortEnd({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
		setLocations(arrayMove(changedLocations, oldIndex, newIndex));
	}

	// single item (card)
	const SortableItem = SortableElement(({ value }: { value: Location }) => (
		<li className="card-li card-li-location">
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
					title={value.name}
					bordered={false}
					className="novel-custom-card location-card"
				>
					<img src={value.image ? value.image : unknownArea} alt="没图，你能咋滴" />
				</Card>
			</div>
		</li>
	));

	// list of cards
	const SortableList = SortableContainer(({ items }: { items: Location[] }) => {
		return (
			<ul>
				{items.map((value: Location, index: number) => (
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
					locations.map((location: Location) => (
						<Col span={8} key={location.id} className="card-container">
							<div
								className="delete-icon"
								onClick={(e: React.MouseEvent) => onOpenModal(e, location.id)}
							>
								<Icon type="close" />
							</div>
							<Card
								title={location.name}
								bordered={false}
								hoverable
								className="novel-custom-card location-card"
								onClick={() => {
									props.history.push(`/location/${novel_id}/${location.id}`);
								}}
							>
								<img src={location.image ? location.image : unknownArea} alt="没图，你能咋滴" />
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
					indeterminate={checkedList.length > 0 && checkedList.length < locations.length}
					onChange={onCheckAllChange}
					checked={checkedList.length === locations.length}
					className="check-all-box"
				>
					势力全选
				</Checkbox>
				<SortableList axis="xy" items={changedLocations} onSortEnd={onSortEnd} />
			</div>
		);
	}

	return (
		<Row>
			{
				isEdit ? editJSX() : nonEditJSX()
			}
			{
				!locations.length && (
					<Col span={6}>
						<Card
							title="还没有势力哦..."
							bordered={false}
							hoverable
							className="novel-custom-card add-character-card"
							onClick={onCreateLocation}
						>
							<Icon type="usergroup-add" /> 新建势力
						</Card>
					</Col>
				)
			}
			<Modal
				title="删除势力"
				visible={showModal}
				onOk={onDeleteLocation}
				onCancel={onCloseModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteLocation}
						ghost
					>确认
					</Button>
				]}
			>
				势力删除后可以去垃圾箱恢复！是否继续？
			</Modal>
		</Row>
	);
};

export default withRouter(LocationSection);
