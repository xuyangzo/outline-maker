import * as React from 'react';
import { Col, message as Message, Card, Row, Modal, Button } from 'antd';

// type declaration
import { InventoryTrashProps, TrashInventoryDataValue } from './inventoryTrashDec';

// database operations
import { getAllInventoriesGivenIdList, deleteInventoryPermanently } from '../../../../db/operations/inventory-ops';
import { putbackInventory } from '../../../../db/operations/trash-ops';

const InventoryTrash = (props: InventoryTrashProps) => {
	const { inventories, refresh, batchDelete } = props;

	// hooks
	const [showBackModal, setBackModal] = React.useState<boolean>(false);
	const [showDeleteModal, setDeleteModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [inventoryDetails, setInventoryDetails] = React.useState<TrashInventoryDataValue[]>([]);

	// get locations when props.locations changes & didmount
	React.useEffect(
		() => {
			// if batch delete
			if (batchDelete) {
				Promise
					.all(inventories.map((id: number) => deleteInventoryPermanently(id)))
					.then(() => {
						Message.success('道具已永久删除！');
						// refresh
						refresh();
					})
					.catch((err: DatabaseError) => {
						Message.error(err.message);
					});

			}
			// otherwise, update inventories
			else getInventories();
		},
		[props.inventories, props.batchDelete]
	);

	// get inventories
	function getInventories() {
		getAllInventoriesGivenIdList(inventories)
			.then((inventories: TrashInventoryDataValue[]) => {
				setInventoryDetails(inventories);
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

	// delete inventory
	function onDeleteInventory() {
		// delete inventory permanently from db
		deleteInventoryPermanently(selected)
			.then(() => {
				// alert success
				Message.success('永久删除道具成功！');
				// close modal
				onCloseDeleteModal();
				// refresh inventories
				refresh();
			})
			.catch((err: DatabaseError) => {
				// close modal
				onCloseDeleteModal();
				// alert error
				Message.error(err.message);
			});
	}

	// put back inventory
	function onPutBackInventory() {
		// put back inventory from db
		putbackInventory(selected)
			.then(() => {
				// alert success
				Message.success('道具已经放回原处！');
				// close modal
				onCloseBackModal();
				// refresh inventories
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
				inventoryDetails.map((inventory: TrashInventoryDataValue) => (
					<Col span={8} key={inventory.id}>
						<Card
							title={inventory.name}
							bordered={false}
							hoverable
							className="custom-card"
						>
							<Button
								type="danger"
								ghost
								block
								className="green-button put-back-button"
								onClick={(e: React.MouseEvent) => onOpenBackModal(e, inventory.id)}
							>
								放回原处
							</Button>
							<Button
								type="danger"
								ghost
								block
								onClick={(e: React.MouseEvent) => onOpenDeleteModal(e, inventory.id)}
							>
								永久删除
							</Button>
						</Card>
					</Col>
				))
			}
			<Modal
				title="永久删除道具"
				visible={showDeleteModal}
				onOk={onDeleteInventory}
				onCancel={onCloseDeleteModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseDeleteModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteInventory}
						ghost
					>确认
					</Button>
				]}
			>
				道具永久删除后无法恢复！！！
			</Modal>
			<Modal
				title="放回道具"
				visible={showBackModal}
				onOk={onPutBackInventory}
				onCancel={onCloseBackModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseBackModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onPutBackInventory}
						ghost
					>确认
					</Button>
				]}
			>
				是否将道具放回原处？
			</Modal>
		</Row>
	);
};

export default InventoryTrash;
