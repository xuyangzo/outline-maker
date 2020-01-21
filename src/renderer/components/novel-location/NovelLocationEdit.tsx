import * as React from 'react';
import { Col, message as Message, Card, Icon, Button, Checkbox, PageHeader, Input } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import classnames from 'classnames';
const { Search } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { NovelLocationProps } from './novelLocationDec';
import { Location, LocationDataValue } from '../location/locationDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// custom components
import BatchDeleteModel from './batch-delete-modal/BatchDeleteModal';

// database operations
import { updateLocation, getAllLocationsGivenNovel, searchLocation } from '../../../db/operations/location-ops';

// image
import empty from '../../../public/empty-character.png';
import unknownArea from '../../../public/unknown_gray.jpg';

const NovelLocationEdit = (props: NovelLocationProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// state hooks
	const [showBatchDeleteModel, setBatchDeleteModel] = React.useState<boolean>(false);
	const [checkedList, setCheckedList] = React.useState<string[]>([]);
	const [locations, setLocations] = React.useState<Location[]>([]);
	const [shouldRender, setShouldRender] = React.useState<boolean>(false);
	const [timer, setTimer] = React.useState<any>(null);

	// use callback hook to listen to the change of locations
	const handleSavePress = React.useCallback(
		(e: KeyboardEvent) => {
			onSavePress(e, locations);
		},
		[locations]
	);

	// use effect hook
	React.useEffect(
		() => {
			// add event listener for control + s
			document.addEventListener('keydown', handleSavePress);

			// clean up
			return () => {
				document.removeEventListener('keydown', handleSavePress);
			};
		},
		[handleSavePress]
	);
	// separate get locations and savepress hooks
	React.useEffect(getLocations, [props.match.params.novel_id]);

	// when use press control + s
	function onSavePress(e: KeyboardEvent, locations: Location[]) {
		const controlPress = e.ctrlKey || e.metaKey;
		const sPress = String.fromCharCode(e.which).toLowerCase() === 's';
		if (controlPress && sPress) {
			onSaveChanges(locations);
		}
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
					.then((result: any) => {
						const locations: Location[] = result.map(({ dataValues }: { dataValues: LocationDataValue }) => {
							const { id, image, intro, texture, location, controller, name } = dataValues;
							return { id, image, intro, texture, location, controller, name };
						});

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
		if (checked) setCheckedList(locations.map((location: Location) => location.id.toString()));
		// uncheck all checkbox
		else setCheckedList([]);
	}

	// when reorder finishes triggering
	function onSortEnd({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
		setLocations(arrayMove(locations, oldIndex, newIndex));
	}

	// save changes
	function onSaveChanges(locations: Location[]) {
		// update orders
		const promises: Promise<any>[] = locations.map((location: Location, index: number) => {
			return updateLocation(location.id, { novelPageOrder: index + 1 });
		});

		Promise
			.all(promises)
			.then(() => {
				// alert success
				Message.success('保存成功！');
				// refresh locations
				getLocations();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all locations
	function getLocations() {
		getAllLocationsGivenNovel(novel_id)
			.then((result: any) => {
				const locations: Location[] = result.map(({ dataValues }: { dataValues: LocationDataValue }) => {
					const { id, image, intro, texture, location, controller, name } = dataValues;
					return { id, image, intro, texture, location, controller, name };
				});

				// set locations
				setLocations(locations);
				// should render
				setShouldRender(true);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
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

	return (
		<Col
			span={19}
			className={
				classnames('novel-character', {
					'main-grow': !expand
				})
			}
		>
			<div>
				<PageHeader
					title={''}
					onBack={() => props.history.goBack()}
					extra={[
						(
							<Button type="danger" key="batch-delete" ghost onClick={() => setBatchDeleteModel(true)}>
								<Icon type="delete" />批量删除
							</Button>
						),
						(
							<Button type="primary" key="quit-edit" ghost onClick={() => props.history.goBack()}>
								<Icon type="rollback" />退出编辑
							</Button>
						),
						(
							<Button
								type="primary"
								key="save"
								ghost
								className="green-button"
								onClick={() => onSaveChanges(locations)}
							>
								<Icon type="save" />保存编辑
							</Button>
						)
					]}
					className="main-header"
				/>
				<div className="novel-character-container novel-character-container-edit">
					<Search
						placeholder="搜索势力..."
						onChange={onSearchChange}
						className="search-box-edit"
						allowClear
					/>
					<Checkbox
						indeterminate={checkedList.length > 0 && checkedList.length < locations.length}
						onChange={onCheckAllChange}
						checked={checkedList.length === locations.length && locations.length !== 0}
						className="check-all-box"
					>
						势力全选
					</Checkbox>
					<SortableList axis="xy" items={locations} onSortEnd={onSortEnd} />
				</div>
			</div>
			{
				shouldRender && !locations.length && (
					<div className="empty-character">
						<h2>暂时没有势力呢...</h2>
						<img src={empty} alt="暂时没有图片..." />
					</div>
				)
			}
			<BatchDeleteModel
				showModel={showBatchDeleteModel}
				checkedList={checkedList}
				closeModel={() => setBatchDeleteModel(false)}
				refreshLocation={getLocations}
				clearCheckedList={() => setCheckedList([])}
			/>
		</Col>
	);
};

export default withRouter(NovelLocationEdit);
