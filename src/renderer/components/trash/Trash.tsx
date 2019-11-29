import * as React from 'react';
import { TrashProps, TrashState, TrashDataValue } from './TrashDec';
import { OutlineDataValue, Outline } from '../sidebar/sidebarDec';
import { Col, Row, Card, Button, Modal, message as Message } from 'antd';
import classnames from 'classnames';
import { DatabaseError } from 'sequelize';

import { withRouter } from 'react-router-dom';
import './trash.scss';

import TrashModal from '../../../db/models/Trash';
import Outlines from '../../../db/models/Outlines';

class Trash extends React.Component<TrashProps, TrashState> {
	constructor(props: TrashProps) {
		super(props);
		this.state = {
			outlines: [],
			confirmVisible: false,
			backVisible: false,
			selected: 0
		};
	}

	componentDidMount = () => {
		TrashModal
			.findAll()
			.then((result: any) => {
				// all outlines in trash
				const outlines: string[] = result.map(({ dataValues }: { dataValues: TrashDataValue }) => {
					const { outline_id } = dataValues;
					return outline_id;
				});

				// grab title and description for those outlines
				return Outlines.
					findAll({
						where: { id: outlines },
						order: [['updatedAt', 'DESC']]
					});
			})
			.then((result: any) => {
				// all detailed outlines in trash
				const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
					const { id, title, description } = dataValues;
					return { id, title, description };
				});
				this.setState({
					outlines
				});
			})
			.catch((err: DatabaseError) => {
				console.error(err);
			});
	}

	onOpen = (id: number) => {
		this.setState({ confirmVisible: true, selected: id });
	}

	onBackOpen = (id: number) => {
		this.setState({ backVisible: true, selected: id });
	}

	onCancel = () => {
		this.setState({ confirmVisible: false, selected: 0 });
	}

	onBackCancel = () => {
		this.setState({ backVisible: false, selected: 0 });
	}

	// permanent deletion
	onDelete = () => {
		Promise
			.all([
				TrashModal
					.destroy({
						where: {
							outline_id: this.state.selected
						}
					}),
				Outlines
					.destroy({
						where: {
							id: this.state.selected
						}
					})
			])
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
		Promise
			.all([
				TrashModal
					.destroy({
						where: {
							outline_id: this.state.selected
						}
					}),
				Outlines
					.update(
						{ deleted: 0 },
						{ where: { id: this.state.selected } }
					)
			])
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

	render() {
		const { expand } = this.props;

		return (
			<Col
				span={19}
				className={
					classnames('trash', {
						'main-grow': !expand
					})
				}
			>
				<Row>
					{
						this.state.outlines.map((outline: Outline) => (
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
