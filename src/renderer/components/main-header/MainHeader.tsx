import * as React from 'react';
import { Icon, Button, PageHeader, message as Message, Modal } from 'antd';

// enable history
import { withRouter } from 'react-router-dom';

// type decalration
import { MainHeaderProps, MainHeaderState } from './mainHeaderDec';
import { DatabaseError } from 'sequelize';

// sequelize modals
import Outlines from '../../../db/models/Outlines';
import Favorite from '../../../db/models/Favorite';
import Trash from '../../../db/models/Trash';

// sass
import './main-header.scss';

class MainHeader extends React.Component<MainHeaderProps, MainHeaderState> {
	constructor(props: MainHeaderProps) {
		super(props);
		this.state = {
			confirmVisible: false,
			isFav: false
		};
	}

	componentWillReceiveProps = (newProps: MainHeaderProps) => {
		const id: string = newProps.location.pathname.slice(9);
		// check if current outline is favorite
		Favorite
			.findOne({
				where: {
					id
				}
			})
			.then((result: any) => {
				if (result) {
					// set heart icon to be filled
					this.setState({ isFav: true });
				} else {
					// set heart icon to be outlined
					this.setState({ isFav: false });
				}
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	componentDidMount = () => {
		const id: string = this.props.location.pathname.slice(9);
		// check if current outline is favorite
		Favorite
			.findOne({
				where: {
					id
				}
			})
			.then((result: any) => {
				if (result) {
					// set heart icon to be filled
					this.setState({ isFav: true });
				} else {
					// set heart icon to be outlined
					this.setState({ isFav: false });
				}
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// open delete modal
	onOpen = () => {
		this.setState({ confirmVisible: true });
	}

	// close delete modal
	onCancel = () => {
		this.setState({ confirmVisible: false });
	}

	// delete outline
	onDelete = () => {
		const id: string = this.props.location.pathname.slice(9);
		Promise
			.all([
				// update outline's deleted column
				Outlines
					.update(
						{ deleted: 1 },
						{ where: { id } }
					),
				// add current outline to trash table
				Trash
					.create({
						outline_id: id
					})
			])
			.then(() => {
				// alert success message
				Message.success('大纲已经被删除！');
				// refresh sidebar
				this.props.refresh();
				// close moal
				this.setState({ confirmVisible: false }, () => {
					// redirect to tutorial page
					this.props.history.push('/trash');
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// add outline to favorite
	onAddFav = () => {
		const id: string = this.props.location.pathname.slice(9);
		Promise
			.all([
				// update outline's fav column
				Outlines
					.update(
						{ fav: 1 },
						{ where: { id } }
					),
				// add current outline to favorite table
				Favorite
					.create({
						outline_id: id
					})
			])
			.then(() => {
				// alert success message
				Message.success('已经添加到收藏夹！');
				// set heart icon to be filled
				this.setState({ isFav: true });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// remove outline from favorite
	onCancelFav = () => {
		const id: string = this.props.location.pathname.slice(9);
		Promise
			.all([
				// delete outline from favorite table
				Favorite
					.destroy({
						where: {
							outline_id: id
						}
					}),
				// update outline's fav in outlines table
				Outlines
					.update(
						{ fav: 0 },
						{ where: { id } }
					)
			])
			.then(() => {
				// alert success
				Message.success('已取消收藏！');
				// set heart icon to be outlined
				this.setState({ isFav: false });
			})
			.catch((err: DatabaseError) => {
				// alert error
				Message.error(err.message);
			});
	}

	render() {
		const { title, description } = this.props;
		const MyIcon = () => (
			<React.Fragment>
				{
					this.state.isFav ? (
						<Icon
							type="heart"
							key="fav"
							className="header-add-fav red-heart"
							onClick={this.onCancelFav}
							theme="filled"
						/>
					) : (
							<Icon
								type="heart"
								key="fav"
								className="header-add-fav"
								onClick={this.onAddFav}
							/>
						)
				}
			</React.Fragment>
		);

		return (
			<React.Fragment>
				<PageHeader
					title={title}
					subTitle={description}
					backIcon={false}
					tags={<MyIcon />}
					extra={[
						<Button type="primary" key="add-person" ghost><Icon type="user-add" />添加人物</Button>,
						<Button type="danger" key="delete" onClick={this.onOpen} ghost>删除大纲</Button>
					]}
					className="main-header"
				/>
				<Modal
					title="Basic Modal"
					visible={this.state.confirmVisible}
					onOk={this.onDelete}
					onCancel={this.onCancel}
					footer={[
						<Button type="danger" key="back" onClick={this.onCancel} ghost>取消</Button>,
						<Button type="primary" key="submit" onClick={this.onDelete} ghost>确认</Button>
					]}
				>
					<p>被删除的大纲可以在垃圾箱进行恢复</p>
				</Modal>
			</React.Fragment>
		);
	}
}

export default withRouter(MainHeader);
