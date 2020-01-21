import * as React from 'react';
import { Col, message as Message, Card, Icon, Button, Checkbox, PageHeader, Collapse, Input } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import classnames from 'classnames';
const { Panel } = Collapse;
const { Search } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { NovelCharacterProps } from './novelCharacterDec';
import { Character, CharacterDataValue } from '../character/characterDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// custom components
import BatchDeleteModel from './batch-delete-modal/BatchDeleteModal';

// database operations
import {
	updateCharacter, searchMainCharacter, searchSubCharacter,
	getAllMainCharactersGivenNovel, getAllSubCharactersGivenNovel
} from '../../../db/operations/character-ops';

// utils
import { imageMapping } from '../../utils/constants';

// sass
import './novel-character.scss';

// image
import empty from '../../../public/empty-character.png';

const NovelCharacterEdit = (props: NovelCharacterProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// state hooks
	const [showBatchDeleteModel, setBatchDeleteModel] = React.useState<boolean>(false);
	const [checkedListMain, setCheckedListMain] = React.useState<string[]>([]);
	const [checkedListSub, setCheckedListSub] = React.useState<string[]>([]);
	const [mainCharacters, setMainCharacters] = React.useState<Character[]>([]);
	const [subCharacters, setSubCharacters] = React.useState<Character[]>([]);
	const [shouldRender, setShouldRender] = React.useState<boolean>(false);
	const [timer, setTimer] = React.useState<any>(null);

	// use callback hook to listen to the change of characters
	const handleSavePress = React.useCallback(
		(e: KeyboardEvent) => {
			onSavePress(e, mainCharacters, subCharacters);
		},
		[mainCharacters, subCharacters]
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
	// separate get characters and savepress hooks
	React.useEffect(getCharacters, [props.match.params.novel_id]);

	// when use press control + s
	function onSavePress(e: KeyboardEvent, mainCharacters: Character[], subCharacters: Character[]) {
		const controlPress = e.ctrlKey || e.metaKey;
		const sPress = String.fromCharCode(e.which).toLowerCase() === 's';
		if (controlPress && sPress) {
			onSaveChanges(mainCharacters.concat(subCharacters));
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
				searchMainCharacter(novel_id, key)
					.then((result: any) => {
						// get all characters
						const characters: Character[] = result.map(({ dataValues }: { dataValues: CharacterDataValue }) => {
							const { id, name, image, gender } = dataValues;
							return { id, name, image: image ? image : imageMapping[gender ? gender : 0] };
						});

						// set main characters
						setMainCharacters(characters);
					})
					.catch((err: DatabaseError) => {
						Message.error(err.message);
					});

				searchSubCharacter(novel_id, key)
					.then((result: any) => {
						// get all characters
						const characters: Character[] = result.map(({ dataValues }: { dataValues: CharacterDataValue }) => {
							const { id, name, image, gender } = dataValues;
							return { id, name, image: image ? image : imageMapping[gender ? gender : 0] };
						});

						// set sub characters
						setSubCharacters(characters);
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

	// when single card's checkbox changed for main characters
	function onCheckboxChangeMain(e: CheckboxChangeEvent) {
		const id: string = e.target.name || '';
		const checked: boolean = e.target.checked;

		// push id to checked list
		if (checked) setCheckedListMain(checkedListMain.concat(id));
		else setCheckedListMain(checkedListMain.filter((checked: string) => checked !== id));
	}

	// when single card's checkbox changed for sub characters
	function onCheckboxChangeSub(e: CheckboxChangeEvent) {
		const id: string = e.target.name || '';
		const checked: boolean = e.target.checked;

		// push id to checked list
		if (checked) setCheckedListSub(checkedListSub.concat(id));
		else setCheckedListSub(checkedListSub.filter((checked: string) => checked !== id));
	}

	// when check all checkbox changes for main characters
	function onCheckAllChangeMain(e: CheckboxChangeEvent) {
		const checked: boolean = e.target.checked;
		// check all checkbox
		if (checked) setCheckedListMain(mainCharacters.map((character: Character) => character.id.toString()));
		// uncheck all checkbox
		else setCheckedListMain([]);
	}

	// when check all checkbox changes for sub characters
	function onCheckAllChangeSub(e: CheckboxChangeEvent) {
		const checked: boolean = e.target.checked;
		// check all checkbox
		if (checked) setCheckedListSub(subCharacters.map((character: Character) => character.id.toString()));
		// uncheck all checkbox
		else setCheckedListSub([]);
	}

	// when reorder finishes triggering for main characters
	function onSortEndMain({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
		setMainCharacters(arrayMove(mainCharacters, oldIndex, newIndex));
	}

	// when reorder finishes triggering for sub characters
	function onSortEndSub({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
		setSubCharacters(arrayMove(subCharacters, oldIndex, newIndex));
	}

	// save changes
	function onSaveChanges(characters: Character[]) {
		// update orders
		const promises: Promise<any>[] = characters.map((character: Character, index: number) => {
			return updateCharacter(character.id, { novelPageOrder: index + 1 });
		});

		Promise
			.all(promises)
			.then(() => {
				// alert success
				Message.success('保存成功！');
				// refresh characters
				getCharacters();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// clear all checked list
	function onClearCheckedList() {
		setCheckedListMain([]);
		setCheckedListSub([]);
	}

	// get all characters
	function getCharacters() {
		getMainCharacters();
		getSubCharacters();
	}

	// get all main characters
	function getMainCharacters() {
		getAllMainCharactersGivenNovel(novel_id)
			.then((result: any) => {
				// get all characters
				const characters: Character[] = result.map(({ dataValues }: { dataValues: CharacterDataValue }) => {
					const { id, name, color, image, gender } = dataValues;
					return { id, name, color, image: image ? image : imageMapping[gender ? gender : 0] };
				});

				// set main characters
				setMainCharacters(characters);
				// should render
				setShouldRender(true);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all sub characters
	function getSubCharacters() {
		getAllSubCharactersGivenNovel(novel_id)
			.then((result: any) => {
				// get all characters
				const characters: Character[] = result.map(({ dataValues }: { dataValues: CharacterDataValue }) => {
					const { id, name, color, image, gender } = dataValues;
					return { id, name, color, image: image ? image : imageMapping[gender ? gender : 0] };
				});

				// set sub characters
				setSubCharacters(characters);
				// should render
				setShouldRender(true);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// single item (card) for main characters
	const SortableItemMain = SortableElement(({ value }: { value: Character }) => (
		<li className="card-li">
			<div key={value.id} className="card-container">
				<div className="card-edit-cover">
					<Checkbox
						className="custom-checkbox"
						onChange={onCheckboxChangeMain}
						name={value.id.toString()}
						checked={checkedListMain.indexOf(value.id.toString()) !== -1}
					/>
				</div>
				<Card
					title={value.name}
					bordered={false}
					className="novel-custom-card"
				>
					<img src={value.image} alt="图片自爆了" />
				</Card>
			</div>
		</li>
	));

	// single item (card) for sub characters
	const SortableItemSub = SortableElement(({ value }: { value: Character }) => (
		<li className="card-li">
			<div key={value.id} className="card-container">
				<div className="card-edit-cover">
					<Checkbox
						className="custom-checkbox"
						onChange={onCheckboxChangeSub}
						name={value.id.toString()}
						checked={checkedListSub.indexOf(value.id.toString()) !== -1}
					/>
				</div>
				<Card
					title={value.name}
					bordered={false}
					className="novel-custom-card"
				>
					<img src={value.image} alt="图片自爆了" />
				</Card>
			</div>
		</li>
	));

	// list of cards for main characters
	const SortableListMain = SortableContainer(({ items }: { items: Character[] }) => {
		return (
			<ul>
				{items.map((value: Character, index: number) => (
					<SortableItemMain key={value.id} index={index} value={value} />
				))}
			</ul>
		);
	});

	// list of cards for sub characters
	const SortableListSub = SortableContainer(({ items }: { items: Character[] }) => {
		return (
			<ul>
				{items.map((value: Character, index: number) => (
					<SortableItemSub key={value.id} index={index} value={value} />
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
							// onClick={() => onSaveChanges(characters)}
							>
								<Icon type="save" />保存编辑
							</Button>
						)
					]}
					className="main-header"
				/>
				<div className="novel-character-container">
					<div className="search-bar">
						<Search
							placeholder="搜索角色..."
							onChange={onSearchChange}
							style={{ width: 200, float: 'right' }}
							allowClear
						/>
					</div>
					<Collapse defaultActiveKey={['main', 'sub']}>
						{
							mainCharacters.length && (
								<Panel header="主角" key="main" style={{ position: 'relative' }}>
									<Checkbox
										indeterminate={checkedListMain.length > 0 && checkedListMain.length < mainCharacters.length}
										onChange={onCheckAllChangeMain}
										checked={checkedListMain.length === mainCharacters.length && mainCharacters.length !== 0}
										className="check-all-box check-all-box-character"
									>
										主角全选
									</Checkbox>
									<SortableListMain axis="xy" items={mainCharacters} onSortEnd={onSortEndMain} />
								</Panel>
							)
						}
						{
							subCharacters.length && (
								<Panel header="配角" key="sub" style={{ position: 'relative' }}>
									<Checkbox
										indeterminate={checkedListSub.length > 0 && checkedListSub.length < subCharacters.length}
										onChange={onCheckAllChangeSub}
										checked={checkedListSub.length === subCharacters.length && subCharacters.length !== 0}
										className="check-all-box check-all-box-character"
									>
										配角全选
									</Checkbox>
									<SortableListSub axis="xy" items={subCharacters} onSortEnd={onSortEndSub} />
								</Panel>
							)
						}
					</Collapse>
				</div>
			</div>
			{
				shouldRender && !mainCharacters.length && !subCharacters.length && (
					<div className="empty-character">
						<h2>暂时没有角色呢...</h2>
						<img src={empty} alt="暂时没有图片..." />
					</div>
				)
			}
			<BatchDeleteModel
				showModel={showBatchDeleteModel}
				checkedList={checkedListMain.concat(checkedListSub)}
				closeModel={() => setBatchDeleteModel(false)}
				refreshCharacter={getCharacters}
				clearCheckedList={onClearCheckedList}
			/>
		</Col>
	);
};

export default withRouter(NovelCharacterEdit);
