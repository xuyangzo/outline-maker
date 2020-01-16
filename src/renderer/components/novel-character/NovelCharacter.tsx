import * as React from 'react';
import { Col, message as Message, Card, Icon, Modal, Button, PageHeader } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { CharacterSectionProps } from './novelCharacterDec';
import { Character, CharacterDataValue } from '../character/characterDec';
import { DatabaseError } from 'sequelize';

// custom components
import CharacterModel from './character-model/CharacterModel';

// database operations
import { deleteCharacterTemp, getAllCharactersGivenNovel } from '../../../db/operations/character-ops';

// utils
import { imageMapping } from '../../utils/constants';

// sass
import './novel-character.scss';

const CharacterSection = (props: CharacterSectionProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [showCreateModel, setCreateModel] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [characters, setCharacters] = React.useState<Character[]>([]);
	React.useEffect(
		getCharacters,
		[props.match.params.novel_id]
	);

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

	// delete character
	function onDeleteCharacter() {
		// delete character temporarily
		deleteCharacterTemp(selected)
			.then(() => {
				// alert success
				Message.success('删除角色成功！');
				// close modal
				onCloseModal();
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
							key="add-character"
							ghost
							className="green-button"
							onClick={() => setCreateModel(true)}
						>
							<Icon type="user-add" />添加角色
						</Button>
					),
					(
						<Button
							key="edit"
							type="danger"
							className="orange-button"
							ghost
							onClick={() => props.history.push(`/character/${novel_id}/edit`)}
						>
							<Icon type="edit" />编辑模式
						</Button>
					)
				]}
				className="novel-character-header"
			/>
			<div className="novel-character-container">
				{
					characters.map((character: Character) => (
						<Col span={6} key={character.id} className="card-container">
							<div
								className="delete-icon"
								onClick={(e: React.MouseEvent) => onOpenModal(e, character.id)}
							>
								<Icon type="close" />
							</div>
							<Card
								title={character.name}
								bordered={false}
								hoverable
								className="novel-custom-card"
								onClick={() => {
									props.history.push(`/character/${novel_id}/${character.id}`);
								}}
							>
								<img src={character.image} alt="图片自爆了" />
							</Card>
						</Col>
					))
				}
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
			<Modal
				title="删除角色"
				visible={showModal}
				onOk={onDeleteCharacter}
				onCancel={onCloseModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteCharacter}
						ghost
					>确认
					</Button>
				]}
			>
				角色删除后可以在垃圾箱里恢复！
			</Modal>
			<CharacterModel
				showModal={showCreateModel}
				closeModal={() => setCreateModel(false)}
				refreshCharacter={getCharacters}
				novel_id={novel_id}
			/>
		</Col>
	);
};

export default withRouter(CharacterSection);
