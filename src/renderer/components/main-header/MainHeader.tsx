import * as React from 'react';
import {
	Icon, Button, PageHeader, message as Message,
	Modal, Dropdown, Menu, Tooltip
} from 'antd';

// custom components
import CharacterModal from './character-modal/CharacterModal';
import TimelineModal from './timeline-modal/TimelineModal';
import IntroModal from './intro-modal/IntroModal';

// enable history
import { withRouter } from 'react-router-dom';

// type decalration
import { MainHeaderProps, MainHeaderState } from './mainHeaderDec';
import { DatabaseError } from 'sequelize';

// database operations
import { findFavorite, addFavorite, deleteFavorite } from '../../../db/operations/fav-ops';
import { updateOutlineFav, updateDeleted } from '../../../db/operations/outline-ops';
import { addTrash } from '../../../db/operations/trash-ops';

// sass
import './main-header.scss';

class MainHeader extends React.Component<MainHeaderProps, MainHeaderState> {
	constructor(props: MainHeaderProps) {
		super(props);
		this.state = {
			confirmVisible: false,
			characterVisible: false,
			timelineVisible: false,
			introVisible: false,
			isFav: false
		};
	}

	componentWillReceiveProps = (newProps: MainHeaderProps) => {
		const id: string = newProps.location.pathname.slice(9);
		this.setHeartIcon(id);
	}

	componentDidMount = () => {
		const id: string = this.props.location.pathname.slice(9);
		this.setHeartIcon(id);
	}

	// open delete modal
	onOpen = () => {
		this.setState({ confirmVisible: true });
	}

	// close delete modal
	onCancel = () => {
		this.setState({ confirmVisible: false });
	}

	// open character modal
	onOpenCharacter = () => {
		this.setState({ characterVisible: true });
	}

	// close character modal
	onCancelCharacter = () => {
		this.setState({ characterVisible: false });
	}

	// open timeline modal
	onOpenTimeline = () => {
		this.setState({ timelineVisible: true });
	}

	// close timeline modal
	onCancelTimeline = () => {
		this.setState({ timelineVisible: false });
	}

	// open intro modal
	onOpenIntro = () => {
		this.setState({ introVisible: true });
	}

	// close intro modal
	onCancelIntro = () => {
		this.setState({ introVisible: false });
	}

	// delete outline
	onDelete = () => {
		const id: string = this.props.location.pathname.slice(9);
		Promise
			.all([updateDeleted(id, 1), addTrash(id)])
			.then(() => {
				// alert success message
				Message.success('大纲已被删除！');
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
			.all([updateOutlineFav(id, 1), addFavorite(id)])
			.then(() => {
				// alert success message
				Message.success('已添加到收藏夹！');
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
			.all([deleteFavorite(id), updateOutlineFav(id, 0)])
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

	// set heart icon
	setHeartIcon = (id: string) => {
		findFavorite(id)
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

	render() {
		const {
			title,
			description,
			createCharacterLocally,
			createTimelineLocally,
			refresh,
			refreshMain,
			onSave
		} = this.props;
		// use different icons for whether current outline is favorite
		const MyIcon = () => (
			<React.Fragment>
				<Tooltip title={description}>
					<span className="main-description-short">{description}</span>
				</Tooltip>
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

		// menu for add drop down
		const addmenu = (
			<Menu>
				<Menu.Item onClick={this.onOpenCharacter}>
					<Icon type="user-add" />添加角色
				</Menu.Item>
				<Menu.Item onClick={this.onOpenTimeline}>
					<Icon type="clock-circle" />添加时间
				</Menu.Item>
			</Menu>
		);

		// menu for edit drop down
		const editmenu = (
			<Menu>
				<Menu.Item onClick={this.onOpenIntro}>
					<Icon type="profile" />编辑简介
				</Menu.Item>
				<Menu.Item onClick={this.onOpen} className="delete-outline-menuitem">
					<Icon type="close-circle" />删除大纲
				</Menu.Item>
			</Menu>
		);

		return (
			<React.Fragment>
				<PageHeader
					title={title}
					backIcon={false}
					tags={<MyIcon />}
					extra={[
						<Dropdown key="add" overlay={addmenu} placement="bottomCenter">
							<Button type="primary" key="add-person" ghost>
								<Icon type="folder-add" />添加内容
							</Button>
						</Dropdown>,
						<Dropdown key="edit" overlay={editmenu} placement="bottomCenter">
							<Button type="danger" className="orange-button" ghost>
								<Icon type="edit" />编辑大纲
							</Button>
						</Dropdown>,
						<Button
							key="save"
							type="danger"
							className="green-button"
							onClick={onSave}
							ghost
						>
							<Icon type="save" />保存
						</Button>
					]}
					className="main-header"
				/>
				<Modal
					title="删除大纲确认"
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
				<CharacterModal
					showModal={this.state.characterVisible}
					closeModal={this.onCancelCharacter}
					createCharacterLocally={createCharacterLocally}
				/>
				<TimelineModal
					showModal={this.state.timelineVisible}
					closeModal={this.onCancelTimeline}
					createTimelineLocally={createTimelineLocally}
				/>
				<IntroModal
					title={title}
					description={description}
					id={this.props.location.pathname.slice(9)}
					refreshSidebar={refresh}
					refreshMain={refreshMain}
					showModal={this.state.introVisible}
					closeModal={this.onCancelIntro}
				/>
			</React.Fragment>
		);
	}
}

export default withRouter(MainHeader);
