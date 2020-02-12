import * as React from 'react';
import { Col, message as Message, Collapse, PageHeader, Button, Icon } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import NovelModal from './novel-modal/NovelModal';

// type declaration
import { NovelProps, NovelDataValue } from './novelDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getNovel } from '../../../db/operations/novel-ops';
import { getWorldviewGivenNovel } from '../../../db/operations/background-ops';

// utils
import { tagColors } from '../../utils/constants';

// sass
import './novel.scss';

const Novel = (props: NovelProps) => {
	const { id } = props.match.params;
	const { expand, refreshSidebar } = props;

	// hooks
	const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');
	const [categories, setCategories] = React.useState<string[]>([]);
	const [worldview, setWorldview] = React.useState<string>('');
	React.useEffect(
		() => {
			getWorldview();
			getNovelContent();
		},
		[props.match.params.id]
	);

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
						<Button
							key="edit"
							type="danger"
							className="orange-button"
							ghost
							onClick={() => props.history.push(`/novel/${id}/edit`)}
						>
							<Icon type="edit" />编辑模式
						</Button>
					),
					(
						<Button key="delete" type="danger" ghost onClick={() => setShowDeleteModal(true)}>
							<Icon type="close-circle" />删除小说
						</Button>
					)
				]}
				className="main-header"
			/>
			<div className="novel-content">
				<div style={{ position: 'relative' }}>
					<h2 style={{ display: 'inline-block', marginRight: '10px' }}>{name}</h2>
					<div className="tag-container">
						{
							categories.map((category: string, index: number) => (
								<div
									className="novel-tag"
									key={category}
									style={{
										color: tagColors[index],
										borderColor: tagColors[index]
									}}
								>{category}
								</div>
							))
						}
					</div>
					<p className="novel-description">{description}</p>
					<br />
				</div>
				<Collapse defaultActiveKey={['background']}>
					<Panel header="背景设定" key="background">
						<div style={{ position: 'relative' }}>
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

export default withRouter(Novel);
