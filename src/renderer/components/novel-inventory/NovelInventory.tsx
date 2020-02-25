import * as React from 'react';
import { Col, message as Message, Card, Icon, Modal, Button, PageHeader, Input } from 'antd';
import classnames from 'classnames';
const { Search } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { NovelInventoryProps, NovelInventoryDataValue } from './NovelInventoryDec';

// custom components
import InventoryModal from './inventory-modal/InventoryModal';

// database operations
import {
	getAllInventoriesGivenNovel, deleteInventoryTemp,
	searchInventory
} from '../../../db/operations/inventory-ops';

// sass
import './novel-inventory.scss';

// image
import empty from '../../../public/empty-character.png';

const NovelInventory = (props: NovelInventoryProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [showCreateModel, setCreateModel] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [inventories, setInventories] = React.useState<NovelInventoryDataValue[]>([]);
	const [shouldRender, setShouldRender] = React.useState<boolean>(false);
	const [timer, setTimer] = React.useState<any>(null);

	React.useEffect(getInventories, [props.match.params.novel_id]);

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

	// delete inventory
	function onDeleteInventory() {
		// delete inventory temporarily
		deleteInventoryTemp(selected)
			.then(() => {
				// alert success
				Message.success('删除道具成功！');
				// close modal
				onCloseModal();
				// refresh inventories
				getInventories();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	/**
	 * when input field changes
	 * need to apply debounce for 500ms
	 */
	function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		clearTimeout(timer);
		const key: string = e.target.value;
		const currTimer: any = setTimeout(
			() => {
				searchInventory(novel_id, key)
					.then((inventories: NovelInventoryDataValue[]) => {
						// set locations
						setInventories(inventories);
						// should render
						setShouldRender(true);
					})
					.catch((err: DatabaseError) => {
						Message.error(err.message);
					});
			},
			300
		);
		// set timer for debounce
		setTimer(currTimer);
	}

	// get all inventories
	function getInventories() {
		getAllInventoriesGivenNovel(novel_id)
			.then((inventories: NovelInventoryDataValue[]) => {
				// set locations
				setInventories(inventories);
				// should render
				setShouldRender(true);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Col
			span={19}
			className={
				classnames('novel-character right-container novel-inventory', {
					'main-grow': !expand
				})
			}
		>
			<PageHeader
				title={''}
				onBack={() => { props.history.goBack(); }}
				extra={[
					(
						<Button
							type="danger"
							key="add-inventory"
							ghost
							className="green-button"
							onClick={() => setCreateModel(true)}
						>
							<Icon type="file-add" />添加道具
						</Button>
					),
					(
						<Button
							key="edit"
							type="danger"
							className="orange-button"
							ghost
							onClick={() => props.history.push(`/outlines/${novel_id}/edit`)}
						>
							<Icon type="edit" />编辑模式
						</Button>
					)
				]}
				className="novel-character-header"
			/>
			<div className="novel-character-container">
				<div className="search-bar">
					<Search
						placeholder="搜索道具..."
						onChange={onSearchChange}
						style={{ width: 200, float: 'right' }}
						allowClear
					/>
				</div>
				{
					inventories.map((inventory: NovelInventoryDataValue) => (
						<Col span={6} key={inventory.id} className="card-container">
							<div
								className="delete-icon"
								onClick={(e: React.MouseEvent) => onOpenModal(e, inventory.id)}
							>
								<Icon type="close" />
							</div>
							<Card
								title={inventory.name}
								bordered={false}
								hoverable
								className="novel-custom-card outline-card"
							// onClick={onOpenDetailModel}
							>
								{
									inventory.image && (
										<img src={inventory.image} className="inventory-image" alt="暂时没有图片..." />
									)
								}
								<p className="overflow-ellipsis">{inventory.description}</p>
							</Card>
						</Col>
					))
				}
			</div>
			{
				shouldRender && !inventories.length && (
					<div className="empty-character">
						<h2>暂时没有道具呢...</h2>
						<img src={empty} alt="暂时没有图片..." />
					</div>
				)
			}
			<Modal
				title="删除道具"
				visible={showModal}
				onOk={onDeleteInventory}
				onCancel={onCloseModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteInventory}
						ghost
					>确认
					</Button>
				]}
			>
				道具删除后可以去垃圾箱恢复！是否继续？
			</Modal>
			<InventoryModal
				showModal={showCreateModel}
				closeModal={() => setCreateModel(false)}
				refreshInventory={getInventories}
				novel_id={novel_id}
			/>
		</Col>
	);
};

export default withRouter(NovelInventory);
