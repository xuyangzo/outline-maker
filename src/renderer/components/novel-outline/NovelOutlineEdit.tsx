import * as React from 'react';
import { Col, message as Message, Card, Icon, Button, Checkbox, PageHeader, Input } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import classnames from 'classnames';
const { Search } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { NovelOutlineProps } from './novelOutlineDec';
import { Outline, OutlineDataValue } from '../main/mainDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// custom components
import BatchDeleteModel from './batch-delete-modal/BatchDeleteModal';

// database operations
import { updateOutline, getAllOutlinesGivenNovel, searchOutline } from '../../../db/operations/outline-ops';

// image
import empty from '../../../public/empty-character.png';

const NovelOutlineEdit = (props: NovelOutlineProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// state hooks
	const [showBatchDeleteModel, setBatchDeleteModel] = React.useState<boolean>(false);
	const [checkedList, setCheckedList] = React.useState<string[]>([]);
	const [outlines, setOutlines] = React.useState<Outline[]>([]);
	const [shouldRender, setShouldRender] = React.useState<boolean>(false);
	const [timer, setTimer] = React.useState<any>(null);

	// use callback hook to listen to the change of outlines
	const handleSavePress = React.useCallback(
		(e: KeyboardEvent) => {
			onSavePress(e, outlines);
		},
		[outlines]
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
	// separate get outlines and savepress hooks
	React.useEffect(getOutlines, [props.match.params.novel_id]);

	// when use press control + s
	function onSavePress(e: KeyboardEvent, outlines: Outline[]) {
		const controlPress = e.ctrlKey || e.metaKey;
		const sPress = String.fromCharCode(e.which).toLowerCase() === 's';
		if (controlPress && sPress) {
			onSaveChanges(outlines);
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
				searchOutline(novel_id, key)
					.then((result: any) => {
						const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
							const { id, title, description } = dataValues;
							return { id, title, description };
						});

						// set outlines
						setOutlines(outlines);
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
		if (checked) setCheckedList(outlines.map((outline: Outline) => outline.id.toString()));
		// uncheck all checkbox
		else setCheckedList([]);
	}

	// when reorder finishes triggering
	function onSortEnd({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
		setOutlines(arrayMove(outlines, oldIndex, newIndex));
	}

	// save changes
	function onSaveChanges(outlines: Outline[]) {
		// update orders
		const promises: Promise<any>[] = outlines.map((outline: Outline, index: number) => {
			return updateOutline(outline.id, { novelPageOrder: index + 1 });
		});

		Promise
			.all(promises)
			.then(() => {
				// alert success
				Message.success('保存成功！');
				// refresh outlines
				getOutlines();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all outlines
	function getOutlines() {
		getAllOutlinesGivenNovel(novel_id)
			.then((result: any) => {
				const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
					const { id, title, description } = dataValues;
					return { id, title, description };
				});

				// set outlines
				setOutlines(outlines);
				// should render
				setShouldRender(true);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
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
								onClick={() => onSaveChanges(outlines)}
							>
								<Icon type="save" />保存编辑
							</Button>
						)
					]}
					className="main-header"
				/>
				<div className="novel-character-container novel-character-container-edit">
					<Search
						placeholder="搜索大纲..."
						onChange={onSearchChange}
						className="search-box-edit"
						allowClear
					/>
					<Checkbox
						indeterminate={checkedList.length > 0 && checkedList.length < outlines.length}
						onChange={onCheckAllChange}
						checked={checkedList.length === outlines.length}
						className="check-all-box"
					>
						大纲全选
					</Checkbox>
					<SortableList axis="xy" items={outlines} onSortEnd={onSortEnd} />
				</div>
			</div>
			{
				shouldRender && !outlines.length && (
					<div className="empty-character">
						<h2>暂时没有大纲呢...</h2>
						<img src={empty} alt="暂时没有图片..." />
					</div>
				)
			}
			<BatchDeleteModel
				showModel={showBatchDeleteModel}
				checkedList={checkedList}
				closeModel={() => setBatchDeleteModel(false)}
				refreshOutline={getOutlines}
				clearCheckedList={() => setCheckedList([])}
			/>
		</Col>
	);
};

export default withRouter(NovelOutlineEdit);
