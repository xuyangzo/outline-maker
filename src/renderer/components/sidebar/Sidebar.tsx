import * as React from 'react';
import { SidebarProps, SidebarState, OutlineDataValue, Outline } from './sidebarDec';
import { Col, Menu, Icon } from 'antd';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

const { SubMenu } = Menu;

import './sidebar.scss';

require('../../../db/relations');
import Outlines from '../../../db/models/Outlines';
import { ClickParam } from 'antd/lib/menu';

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
					// all outlines
					const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
						const { id, title, deleted } = dataValues;
						return { id, title, deleted };
					});

					// filter trash
					const all: Outline[] = outlines.filter((outline: Outline) => !outline.deleted);

					this.setState((prevState: SidebarState) => ({
						...prevState,
						outlines,
						all
					}));
				})
				.catch((err: any) => {

				});
		}
	}

	componentDidMount = () => {
		// set selected keys
		let selected = 'tutorial';
		if (this.props.location.pathname.indexOf('trash') !== -1) {
			selected = 'trash';
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
				order: [['updatedAt', 'DESC']]
			})
			.then((result: any) => {
				// all outlines
				const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
					const { id, title, deleted } = dataValues;
					return { id, title, deleted };
				});

				// filter trash
				const all: Outline[] = outlines.filter((outline: Outline) => !outline.deleted);
				const trash: Outline[] = outlines.filter((outline: Outline) => outline.deleted);

				this.setState((prevState: SidebarState) => ({
					...prevState,
					outlines,
					all,
					trash
				}));
			})
			.catch((err: any) => {

			});
	}

	onSelect = ({ key }: { key: string }) => {
		this.setState((prevState: SidebarState) => ({
			...prevState,
			selected: [key]
		}));
	}

	select = (e: ClickParam) => {
		this.props.history.push(`/outline/${e.key}`);
	}

	toTutorial = (e: ClickParam) => {
		this.props.history.push('/');
	}

	toTrash = () => {
		this.props.history.push('/trash');
	}

	render() {
		const {
			expand,
			growSidebar,
			shrinkSidebar,
			createOutline
		} = this.props;

		const arrow: string = expand ? 'double-left' : 'double-right';
		const action: () => void = expand ? shrinkSidebar : growSidebar;

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
						<Icon type="plus-circle" />&nbsp;&nbsp;&nbsp;添加大纲
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