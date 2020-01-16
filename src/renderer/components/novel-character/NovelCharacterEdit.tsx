import * as React from 'react';
import { Col, message as Message, Card, Icon, Button, Checkbox, PageHeader } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { CharacterSectionProps } from './novelCharacterDec';
import { Character, CharacterDataValue } from '../character/characterDec';
import { DatabaseError } from 'sequelize';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// custom components
import BatchDeleteModel from './batch-delete-model/BatchDeleteModel';

// database operations
import { updateCharacter, getAllCharactersGivenNovel } from '../../../db/operations/character-ops';

// utils
import { ctrlsPress } from '../../utils/utils';
import { imageMapping } from '../../utils/constants';

// sass
import './novel-character.scss';

const CharacterSection = (props: CharacterSectionProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// state hooks
	const [showBatchDeleteModel, setBatchDeleteModel] = React.useState<boolean>(false);
	const [checkedList, setCheckedList] = React.useState<string[]>([]);
	const [characters, setCharacters] = React.useState<Character[]>([]);

	// use callback hook to listen to the change of characters
	const handleSavePress = React.useCallback(
		(e: KeyboardEvent) => {
			onSavePress(e, characters);
		},
		[characters]
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
	function onSavePress(e: KeyboardEvent, characters: Character[]) {
		const controlPress = e.ctrlKey || e.metaKey;
		const sPress = String.fromCharCode(e.which).toLowerCase() === 's';
		if (controlPress && sPress) {
			onSaveChanges(characters);
		}
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
		if (checked) setCheckedList(characters.map((character: Character) => character.id.toString()));
		// uncheck all checkbox
		else setCheckedList([]);
	}

	// when reorder finishes triggering
	function onSortEnd({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
		setCharacters(arrayMove(characters, oldIndex, newIndex));
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

	// get all characters
	function getCharacters() {
		getAllCharactersGivenNovel(novel_id)
			.then((result: any) => {
				// get all characters
				const characters: Character[] = result.map(({ dataValues }: { dataValues: CharacterDataValue }) => {
					const { id, name, color, image, gender } = dataValues;
					return { id, name, color, image: image ? image : imageMapping[gender ? gender : 0] };
				});

				// set characters
				setCharacters(characters);
				// should render
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// single item (card)
	const SortableItem = SortableElement(({ value }: { value: Character }) => (
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
					title={value.name}
					bordered={false}
					className="novel-custom-card"
				>
					<img src={value.image} alt="图片自爆了" />
				</Card>
			</div>
		</li>
	));

	// list of cards
	const SortableList = SortableContainer(({ items }: { items: Character[] }) => {
		return (
			<ul>
				{items.map((value: Character, index: number) => (
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
								onClick={() => onSaveChanges(characters)}
							>
								<Icon type="save" />保存编辑
							</Button>
						)
					]}
					className="main-header"
				/>
				<div className="novel-character-container">
					<Checkbox
						indeterminate={checkedList.length > 0 && checkedList.length < characters.length}
						onChange={onCheckAllChange}
						checked={checkedList.length === characters.length}
						className="check-all-box"
					>
						角色全选
					</Checkbox>
					<SortableList axis="xy" items={characters} onSortEnd={onSortEnd} />
				</div>
			</div>
			{
				!characters.length && (
					<Col span={6}>
						<Card
							title="还没有角色哦..."
							bordered={false}
							hoverable
							className="novel-custom-card add-character-card"
						>
							<Icon type="user-add" /> 新建角色
						</Card>
					</Col>
				)
			}
			<BatchDeleteModel
				showModel={showBatchDeleteModel}
				checkedList={checkedList}
				closeModel={() => setBatchDeleteModel(false)}
				refreshCharacter={getCharacters}
				clearCheckedList={() => setCheckedList([])}
			/>
		</Col>
	);
};

export default withRouter(CharacterSection);
