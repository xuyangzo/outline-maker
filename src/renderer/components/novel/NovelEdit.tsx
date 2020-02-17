import * as React from 'react';
import { Col, message as Message, Collapse, PageHeader, Button, Icon, Input } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;
const { TextArea } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import NovelModal from './novel-modal/NovelModal';

// type declaration
import { NovelProps, NovelDataValue } from './novelDec';

// database operations
import { getNovel, updateNovel } from '../../../db/operations/novel-ops';
import { getWorldviewGivenNovel } from '../../../db/operations/background-ops';

// utils
import { tagColors, tags } from '../../utils/constants';

// sass
import './novel.scss';

const NovelEdit = (props: NovelProps) => {
	const { id } = props.match.params;
	const { expand, refreshSidebar } = props;

	// hooks
	const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');
	const [categories, setCategories] = React.useState<string[]>([]);
	const [worldview, setWorldview] = React.useState<string>('');

	// use callback hook to listen to the change of characters
	const handleSavePress = React.useCallback(
		(e: KeyboardEvent) => {
			onSavePress(e, name, description, categories);
		},
		[name, description, categories]
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
	// separate refresh content and save hooks
	React.useEffect(
		() => {
			getWorldview();
			getNovelContent();
		},
		[props.match.params.id]
	);

	// when use press control + s
	function onSavePress(e: KeyboardEvent, name: string, description: string, categories: string[]) {
		const controlPress = e.ctrlKey || e.metaKey;
		const sPress = String.fromCharCode(e.which).toLowerCase() === 's';
		if (controlPress && sPress) {
			onSave(name, description, categories);
		}
	}

	// on input change
	function onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
		const name = event.target.value;
		setName(name);
	}

	// the event of textarea change is different, so use a separate method
	function onDescriptionChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		const description = event.target.value;
		setDescription(description);
	}

	// add new tag
	function onAddTag(tag: string) {
		// at most 4 tags can be added at the same time
		if (categories.length === 4) {
			Message.error('最多只能选择四个标签！');
			return;
		}

		// avoid add duplicate tags
		if (categories.indexOf(tag) !== -1) return;

		setCategories(categories.concat(tag));
	}

	// delete new tag
	function onDeleteTag(tag: string) {
		setCategories(categories.filter((currTag: string) => currTag !== tag));
	}

	// on save
	function onSave(name: string, description: string, categories: string[]) {
		updateNovel(id, { name, description, categories: categories.join(',') })
			.then(() => {
				Message.success('保存成功！');
				// refresh content
				getNovelContent();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get world view
	function getWorldview() {
		getWorldviewGivenNovel(id)
			.then((worldview: string) => {
				setWorldview(worldview);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get novel content
	function getNovelContent() {
		getNovel(id)
			.then((content: NovelDataValue) => {
				const { name, description, categories } = content;
				setName(name);
				setDescription(description);
				setCategories(categories ? categories.split(',') : []);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Col
			span={19}
			className={
				classnames('novel', {
					'main-grow': !expand
				})
			}
		>
			<PageHeader
				title={''}
				onBack={() => { props.history.goBack(); }}
				extra={[
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
							onClick={() => onSave(name, description, categories)}
						>
							<Icon type="save" />保存编辑
						</Button>
					)
				]}
				className="main-header"
			/>
			<div className="novel-content">
				<div style={{ position: 'relative' }}>
					<input
						type="text"
						value={name}
						className="novel-title-input"
						onChange={onNameChange}
						placeholder="小说名字应该在 12 个字以内！"
					/>
					<div className="tag-container tag-container-edit">
						<div className="tag-container-header tag-container-header-edit">
							{
								categories.map((category: string, index: number) => (
									<div
										className="novel-tag"
										key={category}
										style={{
											color: tagColors[index],
											borderColor: tagColors[index]
										}}
									>
										{category}&nbsp;&nbsp;
										<Icon
											type="close"
											style={{ color: tagColors[index], cursor: 'pointer' }}
											onClick={() => onDeleteTag(category)}
										/>
									</div>
								))
							}
						</div>
						<div className="tag-container-content">
							{
								tags.map((tag: string) => (
									<div
										className="novel-tag novel-tag-edit"
										key={tag}
										onClick={() => onAddTag(tag)}
									>
										{tag}
									</div>
								))
							}
						</div>
					</div>
					<TextArea
						value={description}
						onChange={onDescriptionChange}
						autoSize={
							{ minRows: 10, maxRows: 10 }
						}
						placeholder="简介应该在 300 个字之内"
						style={{ width: '60%', display: 'block' }}
					/>
					<br />
				</div>
				<Collapse defaultActiveKey={['background']}>
					<Panel header="背景设定" key="background">
						<div style={{ position: 'relative' }}>
							<div className="background-edit-cover">无法直接编辑世界观</div>
							<div className="background-property">
								{worldview}
							</div>
							<Button
								type="primary"
								className="green-button borderless-button"
								style={{ marginLeft: 15, marginTop: 20 }}
								onClick={() => { props.history.push(`/background/${id}`); }}
								ghost
							>
								查看更多设定 <Icon type="arrow-right" />
							</Button>
						</div>
					</Panel>
				</Collapse>
			</div>
			<br /><br />
			<NovelModal
				refreshSidebar={refreshSidebar}
				showModal={showDeleteModal}
				closeModal={() => setShowDeleteModal(false)}
				id={id}
			/>
		</Col>
	);
};

export default withRouter(NovelEdit);
