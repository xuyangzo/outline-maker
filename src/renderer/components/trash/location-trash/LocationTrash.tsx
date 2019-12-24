import * as React from 'react';
import { Col, message as Message, Card, Row, Modal, Button } from 'antd';

// type declaration
import { LocationTrashProps } from './locationTrashDec';
import { LocationShortDataValue } from '../../location/locationDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getLocationShort, deleteLocationPermanently } from '../../../../db/operations/location-ops';
import { putbackLocation } from '../../../../db/operations/trash-ops';

const LocationTrash = (props: LocationTrashProps) => {
	const { locations, refresh } = props;

	// hooks
	const [showBackModal, setBackModal] = React.useState<boolean>(false);
	const [showDeleteModal, setDeleteModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [locationDetails, setLocationDetails] = React.useState<LocationShortDataValue[]>([]);

	// get characters when props.characters changes & didmount
	React.useEffect(getLocations, [props.locations]);

	// get locations
	function getLocations() {
		const promises: Promise<any>[] = locations.map((loc_id: number) => {
			return getLocationShort(loc_id);
		});
		Promise
			.all(promises)
			.then((result: any) => {
				const locations = result.map(({ dataValues }: { dataValues: LocationShortDataValue }) => dataValues);
				setLocationDetails(locations);
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
			.then(() => {
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
				locationDetails.map((location: LocationShortDataValue) => (
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
