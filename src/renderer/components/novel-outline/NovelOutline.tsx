import * as React from 'react';
import { Col, message as Message, Card, Icon, Modal, Button, PageHeader, Input } from 'antd';
import classnames from 'classnames';
const { Search } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { NovelOutlineProps } from './novelOutlineDec';
import { Outline, OutlineDataValue } from '../main/mainDec';
import { DatabaseError } from 'sequelize';

// custom components
import OutlineModal from './outline-modal/OutlineModal';

// database operations
import { deleteOutlineTemp, getAllOutlinesGivenNovel, searchOutline } from '../../../db/operations/outline-ops';

// image
import empty from '../../../public/empty-character.png';

const NovelOutline = (props: NovelOutlineProps) => {
	const { novel_id } = props.match.params;
	const { expand } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [showCreateModel, setCreateModel] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [outlines, setOutlines] = React.useState<Outline[]>([]);
	const [shouldRender, setShouldRender] = React.useState<boolean>(false);
	const [timer, setTimer] = React.useState<any>(null);

	React.useEffect(getOutlines, [props.match.params.novel_id]);

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

	// delete outline
	function onDeleteOutline() {
		// delete outline temporarily
		deleteOutlineTemp(selected)
			.then(() => {
				// alert success
				Message.success('删除大纲成功！');
				// close modal
				onCloseModal();
				// refresh outlines
				getOutlines();
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
							key="add-outline"
							ghost
							className="green-button"
							onClick={() => setCreateModel(true)}
						>
							<Icon type="file-add" />添加大纲
						</Button>
					),
					(
						<Button
							key="edit"
							type="danger"
							className="orange-button"
							ghost
							onClick={() => props.history.push(`/outline/${novel_id}/edit`)}
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
						placeholder="搜索大纲..."
						onChange={onSearchChange}
						style={{ width: 200, float: 'right' }}
						allowClear
					/>
				</div>
				{
					outlines.map((outline: Outline) => (
						<Col span={6} key={outline.id} className="card-container">
							<div
								className="delete-icon"
								onClick={(e: React.MouseEvent) => onOpenModal(e, outline.id)}
							>
								<Icon type="close" />
							</div>
							<Card
								title={outline.title}
								bordered={false}
								hoverable
								className="novel-custom-card outline-card"
								onClick={() => {
									props.history.push(`/outline/${novel_id}/${outline.id}`);
								}}
							>
								<p>{outline.description}</p>
							</Card>
						</Col>
					))
				}
			</div>
			{
				shouldRender && !outlines.length && (
					<div className="empty-character">
						<h2>暂时没有大纲呢...</h2>
						<img src={empty} alt="暂时没有图片..." />
					</div>
				)
			}
			<Modal
				title="删除大纲"
				visible={showModal}
				onOk={onDeleteOutline}
				onCancel={onCloseModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteOutline}
						ghost
					>确认
					</Button>
				]}
			>
				大纲删除后可以去垃圾箱恢复！是否继续？
			</Modal>
			<OutlineModal
				showModal={showCreateModel}
				closeModal={() => setCreateModel(false)}
				refreshOutline={getOutlines}
				novel_id={novel_id}
			/>
		</Col>
	);
};

export default withRouter(NovelOutline);
