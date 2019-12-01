import * as React from 'react';
import { Col, Menu, Icon, message as Message } from 'antd';
import classnames from 'classnames';
const { SubMenu } = Menu;

// enable history
import { withRouter } from 'react-router-dom';

// type decalaration
import { SidebarProps, SidebarState, OutlineDataValue, Outline } from './sidebarDec';
import { DatabaseError } from 'sequelize';
import { ClickParam } from 'antd/lib/menu';

// sequelize modals
import Outlines from '../../../db/models/Outlines';

// sidebar
import './sidebar.scss';

class Sidebar extends React.Component<SidebarProps, SidebarState> {
	constructor(props: SidebarProps) {
		super(props);
		this.state = {
			outlines: [],
			all: [],
			selected: []
		};
	}

	componentWillReceiveProps = (newProps: SidebarProps) => {
		// set selected keys
		let selected = 'tutorial';
		if (newProps.location.pathname.indexOf('trash') !== -1) {
			selected = 'trash';
		} else if (newProps.location.pathname.indexOf('favorite') !== -1) {
			selected = 'fav';
		} else if (newProps.location.pathname.indexOf('outline') !== -1) {
			selected = newProps.location.pathname.slice(9);
		}
		this.setState((prevState: SidebarState) => ({
			...prevState,
			selected: [selected]
		}));

		// if need to refresh, refresh
		if (newProps.refresh) {
			Outlines
				.findAll({
					order: [['id', 'DESC']]
				})
				.then((result: any) => {
					// all outlines including deleted ones
					const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
						const { id, title, deleted } = dataValues;
						return { id, title, deleted };
					});

					// filter trash to get all non-deleted ones
					const all: Outline[] = outlines.filter((outline: Outline) => !outline.deleted);

					this.setState((prevState: SidebarState) => ({
						...prevState,
						outlines,
						all
					}));
				})
				.catch((err: DatabaseError) => {
					Message.error(err.message);
				});
		}
	}

	componentDidMount = () => {
		// set selected keys
		let selected = 'tutorial';
		if (this.props.location.pathname.indexOf('trash') !== -1) {
			selected = 'trash';
		} else if (this.props.location.pathname.indexOf('favorite') !== -1) {
			selected = 'fav';
		} else if (this.props.location.pathname.indexOf('outline') !== -1) {
			selected = this.props.location.pathname.slice(9);
		}
		this.setState((prevState: SidebarState) => ({
			...prevState,
			selected: [selected]
		}));

		// grab data
		Outlines
			.findAll({
				order: [['id', 'DESC']]
			})
			.then((result: any) => {
				// all outlines including deleted ones
				const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
					const { id, title, deleted } = dataValues;
					return { id, title, deleted };
				});

				// filter trash to get all non-deleted ones
				const all: Outline[] = outlines.filter((outline: Outline) => !outline.deleted);
				const trash: Outline[] = outlines.filter((outline: Outline) => outline.deleted);

				this.setState((prevState: SidebarState) => ({
					...prevState,
					outlines,
					all,
					trash
				}));
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// once a menu is selected
	onSelect = ({ key }: { key: string }) => {
		this.setState((prevState: SidebarState) => ({
			...prevState,
			selected: [key]
		}));
	}

	// once a menu is selected, forward to corresponding outline page
	select = (e: ClickParam) => {
		this.props.history.push(`/outline/${e.key}`);
	}

	// go to tutorial page (home page)
	toTutorial = (e: ClickParam) => {
		this.props.history.push('/');
	}

	// go to trash page
	toTrash = () => {
		this.props.history.push('/trash');
	}

	// go to favorite page
	toFavorite = () => {
		this.props.history.push('/favorite');
	}

	render() {
		const {
			expand,
			growSidebar,
			shrinkSidebar,
			createOutline
		} = this.props;

		// sets the toggle action of sidebar
		const arrow: string = expand ? 'double-left' : 'double-right';
		const action: () => void = expand ? shrinkSidebar : growSidebar;

		// sets default selected
		let selected = 'tutorial';
		if (this.props.location.pathname.indexOf('outline') !== -1) {
			selected = this.props.location.pathname.slice(9);
		}

		return (
			<section id="sidebar" className="sidebar">
				<Col
					span={5}
					className={classnames('sidebar-menu', {
						'sidebar-shrink': !expand
					})}
				>
					<aside
						className={classnames('toggle-sidebar', {
							'toggle-sidebar-moveleft': !expand
						})}
						onClick={action}
					>
						<Icon type={arrow} />
					</aside>
					<button className="add-outline-button" onClick={createOutline}>
						<Icon type="plus-circle" />&nbsp;&nbsp;&nbsp;创建大纲
					</button>
					<Menu
						defaultSelectedKeys={[selected]}
						selectedKeys={this.state.selected}
						defaultOpenKeys={['all']}
						mode="inline"
						onSelect={this.onSelect}
					>
						<Menu.Item key="tutorial" onClick={this.toTutorial}>
							<Icon type="question-circle" />教程
						</Menu.Item>
						<SubMenu
							key="all"
							title={
								<span>
									<Icon type="file-text" />
									<span>全部大纲</span>
								</span>
							}
						>
							{
								this.state.all.map((outline: Outline) => (
									<Menu.Item key={outline.id} onClick={this.select}>{outline.title}</Menu.Item>
								))
							}
						</SubMenu>
						<Menu.Item key="fav" onClick={this.toFavorite}>
							<Icon type="heart" />收藏夹
						</Menu.Item>
						<SubMenu
							key="draft"
							title={
								<span>
									<Icon type="file" />
									<span>草稿箱</span>
								</span>
							}
						>
							<Menu.Item key="draft-1">Option 5</Menu.Item>
							<Menu.Item key="draft-2">Option 6</Menu.Item>
						</SubMenu>
						<Menu.Item key="trash" onClick={this.toTrash}>
							<Icon type="delete" />垃圾箱
						</Menu.Item>
					</Menu>
				</Col>
			</section>
		);
	}
}

export default withRouter(Sidebar);
