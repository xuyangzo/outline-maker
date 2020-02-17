import * as React from 'react';
import { Col, message as Message, Card, Icon, Modal, Button, PageHeader, Input } from 'antd';
import classnames from 'classnames';
const { Search } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { NovelLocationProps, NovelLocationDataValue } from './novelLocationDec';

// custom components
import LocationModal from './location-modal/LocationModal';

// database operations
import { deleteLocationTemp, getAllLocationsGivenNovel, searchLocation } from '../../../db/operations/location-ops';

// image
import empty from '../../../public/empty-character.png';
import unknownArea from '../../../public/unknown_gray.jpg';

const NovelLocation = (props: NovelLocationProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [showCreateModel, setCreateModel] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [locations, setLocations] = React.useState<NovelLocationDataValue[]>([]);
	const [shouldRender, setShouldRender] = React.useState<boolean>(false);
	const [timer, setTimer] = React.useState<any>(null);

	React.useEffect(getLocations, [props.match.params.novel_id]);

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
				getLocations();
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
				searchLocation(novel_id, key)
					.then((locations: NovelLocationDataValue[]) => {
						// set locations
						setLocations(locations);
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

	// get all locations
	function getLocations() {
		getAllLocationsGivenNovel(novel_id)
			.then((locations: NovelLocationDataValue[]) => {
				// set locations
				setLocations(locations);
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
				classnames('novel-character', {
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
							key="add-location"
							ghost
							className="green-button"
							onClick={() => setCreateModel(true)}
						>
							<Icon type="usergroup-add" />添加势力
						</Button>
					),
					(
						<Button
							key="edit"
							type="danger"
							className="orange-button"
							ghost
							onClick={() => props.history.push(`/locations/${novel_id}/edit`)}
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
						placeholder="搜索势力..."
						onChange={onSearchChange}
						style={{ width: 200, float: 'right' }}
						allowClear
					/>
				</div>
				{
					locations.map((location: NovelLocationDataValue) => (
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
			{
				shouldRender && !locations.length && (
					<div className="empty-character">
						<h2>暂时没有势力呢...</h2>
						<img src={empty} alt="暂时没有图片..." />
					</div>
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
			<LocationModal
				showModal={showCreateModel}
				closeModal={() => setCreateModel(false)}
				refreshLocation={getLocations}
				novel_id={novel_id}
			/>
		</Col>
	);
};

export default withRouter(NovelLocation);
