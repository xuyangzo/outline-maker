import * as React from 'react';
import { Col, message as Message, Card, Row, Modal, Button } from 'antd';

// type declaration
import { LocationTrashProps, TrashLocationDataValue } from './locationTrashDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getAllLocationsGivenIdList, deleteLocationPermanently } from '../../../../db/operations/location-ops';
import { putbackLocation } from '../../../../db/operations/trash-ops';

const LocationTrash = (props: LocationTrashProps) => {
	const { locations, refresh, batchDelete } = props;

	// hooks
	const [showBackModal, setBackModal] = React.useState<boolean>(false);
	const [showDeleteModal, setDeleteModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [locationDetails, setLocationDetails] = React.useState<TrashLocationDataValue[]>([]);

	// get locations when props.locations changes & didmount
	React.useEffect(
		() => {
			// if batch delete
			if (batchDelete) {
				Promise
					.all(locations.map((id: number) => deleteLocationPermanently(id)))
					.then(() => {
						Message.success('势力已永久删除！');
						// refresh
						refresh();
					})
					.catch((err: DatabaseError) => {
						Message.error(err.message);
					});

			}
			// otherwise, update locations
			else getLocations();
		},
		[props.locations, props.batchDelete]
	);

	// get locations
	function getLocations() {
		getAllLocationsGivenIdList(locations)
			.then((locations: TrashLocationDataValue[]) => {
				setLocationDetails(locations);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// open back modal
	function onOpenBackModal(e: React.MouseEvent, id: string | number) {
		// prevent bubbling
		e.preventDefault();

		// set selected
		setBackModal(true);
		setSelected(id);
	}

	// close back modal
	function onCloseBackModal() {
		setSelected('');
		setBackModal(false);
	}

	// open delete modal
	function onOpenDeleteModal(e: React.MouseEvent, id: string | number) {
		// prevent bubbling
		e.preventDefault();

		// set selected
		setDeleteModal(true);
		setSelected(id);
	}

	// close delete modal
	function onCloseDeleteModal() {
		setSelected('');
		setDeleteModal(false);
	}

	// delete location
	function onDeleteLocation() {
		// delete location permanently from db
		deleteLocationPermanently(selected)
			.then((result: any) => {
				// alert success
				Message.success('永久删除势力成功！');
				// close modal
				onCloseDeleteModal();
				// refresh locations
				refresh();
			})
			.catch((err: DatabaseError) => {
				// close modal
				onCloseDeleteModal();
				// alert error
				Message.error(err.message);
			});
	}

	// put back location
	function onPutBackLocation() {
		// put back location from db
		putbackLocation(selected)
			.then(() => {
				// alert success
				Message.success('势力已经放回原处！');
				// close modal
				onCloseBackModal();
				// refresh locations
				refresh();
			})
			.catch((err: DatabaseError) => {
				// close modal
				onCloseDeleteModal();
				// alert error
				Message.error(err.message);
			});
	}

	return (
		<Row>
			{
				locationDetails.map((location: TrashLocationDataValue) => (
					<Col span={8} key={location.id}>
						<Card
							title={location.name}
							bordered={false}
							hoverable
							className="custom-card"
						>
							<Button
								type="danger"
								ghost
								block
								className="green-button put-back-button"
								onClick={(e: React.MouseEvent) => onOpenBackModal(e, location.id)}
							>
								放回原处
							</Button>
							<Button
								type="danger"
								ghost
								block
								onClick={(e: React.MouseEvent) => onOpenDeleteModal(e, location.id)}
							>
								永久删除
							</Button>
						</Card>
					</Col>
				))
			}
			<Modal
				title="永久删除势力"
				visible={showDeleteModal}
				onOk={onDeleteLocation}
				onCancel={onCloseDeleteModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseDeleteModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteLocation}
						ghost
					>确认
					</Button>
				]}
			>
				势力永久删除后无法恢复！！！
			</Modal>
			<Modal
				title="放回势力"
				visible={showBackModal}
				onOk={onPutBackLocation}
				onCancel={onCloseBackModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseBackModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onPutBackLocation}
						ghost
					>确认
					</Button>
				]}
			>
				是否将势力放回原处？
			</Modal>
		</Row>
	);
};

export default LocationTrash;
