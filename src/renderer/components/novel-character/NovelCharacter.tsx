import * as React from 'react';
import { Col, message as Message, Card, Icon, Modal, Button, PageHeader, Collapse, Input } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;
const { Search } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { NovelCharacterProps, NovelCharacterDataValues, NovelCharacterDataValue } from './novelCharacterDec';
import { DatabaseError } from 'sequelize';

// custom components
import CharacterModal from './character-modal/CharacterModal';

// database operations
import { deleteCharacterTemp, getAllCharactersGivenNovel, searchCharacter } from '../../../db/operations/character-ops';

// sass
import './novel-character.scss';

// image
import empty from '../../../public/empty-character.png';

const NovelCharacter = (props: NovelCharacterProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [showCreateModel, setCreateModel] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [mainCharacters, setMainCharacters] = React.useState<NovelCharacterDataValue[]>([]);
	const [subCharacters, setSubCharacters] = React.useState<NovelCharacterDataValue[]>([]);
	const [shouldRender, setShouldRender] = React.useState<boolean>(false);
	const [timer, setTimer] = React.useState<any>(null);

	React.useEffect(getCharacters, [props.match.params.novel_id]);

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

	/**
	 * when input field changes
	 * need to apply debounce for 500ms
	 */
	function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		clearTimeout(timer);
		const key: string = e.target.value;
		const currTimer: any = setTimeout(
			() => {
				searchCharacter(novel_id, key)
					.then((result: NovelCharacterDataValues) => {
						const { main, sub } = result;
						// set main characters
						setMainCharacters(main);
						// set sub characters
						setSubCharacters(sub);
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

	// get all characters
	function getCharacters() {
		getAllCharactersGivenNovel(novel_id)
			.then((result: NovelCharacterDataValues) => {
				const { main, sub } = result;
				// set main characters
				setMainCharacters(main);
				// set sub characters
				setSubCharacters(sub);
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
							onClick={() => props.history.push(`/characters/${novel_id}/edit`)}
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
						placeholder="搜索角色..."
						onChange={onSearchChange}
						style={{ width: 200, float: 'right' }}
						allowClear
					/>
				</div>
				<Collapse defaultActiveKey={['main', 'sub']}>
					{
						mainCharacters.length && (
							<Panel header="主角" key="main">
								{
									mainCharacters.map((character: NovelCharacterDataValue) => (
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
							</Panel>
						)
					}
					{
						subCharacters.length && (
							<Panel header="配角" key="sub">
								{
									subCharacters.map((character: NovelCharacterDataValue) => (
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
							</Panel>
						)
					}
				</Collapse>
			</div>
			{
				shouldRender && !mainCharacters.length && !subCharacters.length && (
					<div className="empty-character">
						<h2>暂时没有角色呢...</h2>
						<img src={empty} alt="暂时没有图片..." />
					</div>
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
			<CharacterModal
				showModal={showCreateModel}
				closeModal={() => setCreateModel(false)}
				refreshCharacter={getCharacters}
				novel_id={novel_id}
			/>
		</Col>
	);
};

export default withRouter(NovelCharacter);
