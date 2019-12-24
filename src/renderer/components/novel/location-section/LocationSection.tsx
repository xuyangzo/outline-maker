import * as React from 'react';
import { Col, message as Message, Card, Row, Icon, Modal, Button } from 'antd';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { LocationSectionProps } from './locationSectionDec';
import { Location } from '../../location/locationDec';
import { DatabaseError } from 'sequelize';

// database operations
import { deleteLocationTemp } from '../../../../db/operations/location-ops';

// image
import unknownArea from '../../../../public/unknown_gray.jpg';

const LocationSection = (props: LocationSectionProps) => {
	const { locations, novel_id, onCreateLocation, refreshLocation } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');

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

	return (
		<Row>
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
