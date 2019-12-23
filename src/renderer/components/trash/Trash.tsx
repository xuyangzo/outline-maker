import * as React from 'react';
import { Col, Row, Card, Button, Modal, message as Message, Collapse } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import CharacterTrash from './character-trash/CharacterTrash';

// type declaration
import { DatabaseError } from 'sequelize';
import { TrashProps, TrashState, TrashDataValue } from './TrashDec';
import { CharacterShortDataValue } from '../character/characterDec';
import { OutlineDataValue, Outline } from '../sidebar/sidebarDec';

// database operations
import { deleteOutlinePermanently, putbackOutline, getAllTrashes } from '../../../db/operations/trash-ops';
import { getCharacterShort } from '../../../db/operations/character-ops';

// sass
import './trash.scss';

// image
import empty from '../../../public/empty-trash.png';

class Trash extends React.Component<TrashProps, TrashState> {
	constructor(props: TrashProps) {
		super(props);
		this.state = {
			outlines: [],
			characters: [],
			confirmVisible: false,
			backVisible: false,
			selected: 0,
			shouldRender: false
		};
	}

	componentDidMount = () => {
		getAllTrashes()
			.then((result: any) => {
				// filter novels, outlines, characters, locations
				const novels: number[] = [];
				const outlines: number[] = [];
				const characters: number[] = [];
				const locations: number[] = [];
				result.forEach(({ dataValues }: { dataValues: TrashDataValue }) => {
					const { novel_id, outline_id, character_id, loc_id } = dataValues;
					/**
					 * each array does not conflict with each other
					 */
					if (novel_id) novels.push(novel_id);
					if (outline_id) outlines.push(outline_id);
					if (character_id) characters.push(character_id);
					if (loc_id) locations.push(loc_id);
				});

				this.setState({ characters });

				// all detailed outlines in trash
				this.setState({
					outlines: result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
						return { id: dataValues.id, title: dataValues.title, description: dataValues.description };
					}),
					shouldRender: true
				});
			})
			.catch((err: DatabaseError) => {
				console.error(err);
			});
	}

	// open deletion modal
	onOpen = (id: number) => {
		this.setState({ confirmVisible: true, selected: id });
	}

	// open put back modal
	onBackOpen = (id: number) => {
		this.setState({ backVisible: true, selected: id });
	}

	// cancel deletion modal
	onCancel = () => {
		this.setState({ confirmVisible: false, selected: 0 });
	}

	// cancel put back modal
	onBackCancel = () => {
		this.setState({ backVisible: false, selected: 0 });
	}

	// permanent deletion for outline
	onDelete = () => {
		deleteOutlinePermanently(this.state.selected)
			.then(() => {
				// alert success
				Message.success('大纲已永久删除！');
				// close modal
				this.setState((prevState: TrashState) => ({
					...prevState,
					outlines: prevState.outlines.filter((outline: Outline) => outline.id !== this.state.selected),
					confirmVisible: false,
					selected: 0
				}));
			})
			.catch((err: DatabaseError) => {
				// alert error
				Message.error(err.message);
				// close modal
				this.setState((prevState: TrashState) => ({
					...prevState,
					confirmVisible: false,
					selected: 0
				}));
			});
	}

	// put back outline
	onBack = () => {
		putbackOutline(this.state.selected)
			.then(() => {
				// alert success
				Message.success('大纲已放回原处！');
				// record ouline id to go
				const id = this.state.selected;
				// refresh sidebar
				this.props.refreshSidebar();
				// close modal
				this.setState(
					(prevState: TrashState) => ({
						...prevState,
						outlines: prevState.outlines.filter((outline: Outline) => outline.id !== this.state.selected),
						backVisible: false,
						selected: 0
					}),
					() => {
						// redirect to the page put back
						this.props.history.push(`/outline/${id}`);
					});
			})
			.catch((err: DatabaseError) => {
				// alert error
				Message.error(err.message);
				// close modal
				this.setState((prevState: TrashState) => ({
					...prevState,
					confirmVisible: false,
					selected: 0
				}));
			});
	}

	// get all trashes
	getTrashes = () => {
		getAllTrashes()
			.then((result: any) => {
				// filter novels, outlines, characters, locations
				const novels: number[] = [];
				const outlines: number[] = [];
				const characters: number[] = [];
				const locations: number[] = [];
				result.forEach(({ dataValues }: { dataValues: TrashDataValue }) => {
					const { novel_id, outline_id, character_id, loc_id } = dataValues;
					/**
					 * each array does not conflict with each other
					 */
					if (novel_id) novels.push(novel_id);
					if (outline_id) outlines.push(outline_id);
					if (character_id) characters.push(character_id);
					if (loc_id) locations.push(loc_id);
				});

				this.setState({ characters });
			})
			.catch((err: DatabaseError) => {
				console.error(err);
			});
	}

	render() {
		const { expand } = this.props;
		const { shouldRender, outlines, characters } = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('trash', {
						'main-grow': !expand
					})
				}
			>
				{
					(!outlines.length && !characters.length && shouldRender) && (
						<div className="empty-trash">
							<h2>垃圾箱是空的哟...</h2>
							<br />
							<img src={empty} alt="empty trash" />
						</div>
					)
				}
				{
					(outlines.length || characters.length) && shouldRender && (
						<Collapse defaultActiveKey={['characters', 'outlines']}>
							<Panel header="角色列表" key="characters">
								<CharacterTrash
									characters={characters}
									refresh={this.getTrashes}
								/>
							</Panel>
							<Panel header="大纲列表" key="outlines">
								<Row>
									{
										outlines.map((outline: Outline) => (
											<Col span={8} key={outline.id}>
												<Card
													title={outline.title}
													bordered={false}
													hoverable
													className="custom-card"
												>
													<p className="description">{outline.description}</p>
													<br /><br />
													<Button
														type="danger"
														ghost
														block
														className="green-button put-back-button"
														onClick={() => this.onBackOpen(outline.id)}
													>
														放回原处
													</Button>
													<Button type="danger" ghost block onClick={() => this.onOpen(outline.id)}>永久删除</Button>
												</Card>
											</Col>
										))
									}
								</Row>
							</Panel>
						</Collapse>
					)
				}
				<Modal
					title="永久删除警告"
					visible={this.state.confirmVisible}
					onOk={this.onDelete}
					onCancel={this.onCancel}
					footer={[
						<Button type="danger" key="back" onClick={this.onCancel} ghost>取消</Button>,
						<Button type="primary" key="submit" onClick={this.onDelete} ghost>确认</Button>
					]}
				>
					<p>永久删除后无法恢复！是否继续？</p>
				</Modal>
				<Modal
					title="放回原处？"
					visible={this.state.backVisible}
					onOk={this.onBack}
					onCancel={this.onBackCancel}
					footer={[
						<Button type="danger" key="back" onClick={this.onBackCancel} ghost>取消</Button>,
						<Button type="primary" key="submit" onClick={this.onBack} ghost>确认</Button>
					]}
				>
					<p>是否放回原处？</p>
				</Modal>
			</Col>
		);
	}
}

export default withRouter(Trash);
