import * as React from 'react';
import { Col, message as Message, Card, Row, Icon, Modal, Button, Checkbox } from 'antd';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { LocationSectionProps } from './locationSectionDec';
import { Location } from '../../location/locationDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// database operations
import { deleteLocationTemp } from '../../../../db/operations/location-ops';

// image
import unknownArea from '../../../../public/unknown_gray.jpg';

const LocationSection = (props: LocationSectionProps) => {
	const { locations, novel_id, onCreateLocation, refreshLocation, isEdit } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [checkedList, setCheckedList] = React.useState<string[]>([]);

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

	return (
		<Row>
			{
				isEdit && (
					<Checkbox
						indeterminate={checkedList.length > 0 && checkedList.length < locations.length}
						onChange={onCheckAllChange}
						checked={checkedList.length === locations.length}
						className="check-all-box"
					>
						势力全选
					</Checkbox>
				)
			}
			{
				locations.map((location: Location) => (
					<Col span={8} key={location.id} className="card-container">
						{
							isEdit && (
								<div className="card-edit-cover">
									<Checkbox
										className="custom-checkbox"
										onChange={onCheckboxChange}
										name={location.id.toString()}
										checked={checkedList.indexOf(location.id.toString()) !== -1}
									/>
								</div>
							)
						}
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
							className="custom-card location-card"
							onClick={() => {
								props.history.push(`/location/${novel_id}/${location.id}`);
							}}
						>
							<img src={location.image ? location.image : unknownArea} alt="没图，你能咋滴" />
						</Card>
					</Col>
				))
			}
			{
				!locations.length && (
					<Col span={6}>
						<Card
							title="还没有势力哦..."
							bordered={false}
							hoverable
							className="custom-card add-character-card"
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
