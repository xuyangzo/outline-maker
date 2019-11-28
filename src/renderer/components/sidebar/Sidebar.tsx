import * as React from 'react';
import { SidebarProps, SidebarState, OutlineDataValue, Outline } from './sidebarDec';
import { Col, Menu, Icon } from 'antd';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

const { SubMenu } = Menu;

import SidebarTrash from './trash/SidebarTrash';

import './sidebar.scss';

require('../../../db/relations');
import Outlines from '../../../db/models/Outlines';
import { ClickParam } from 'antd/lib/menu';

class Sidebar extends React.Component<SidebarProps, SidebarState> {
	constructor(props: SidebarProps) {
		super(props);
		this.state = {
			outlines: []
		};
	}

	componentWillReceiveProps = (newProps: SidebarProps) => {
		if (newProps.refresh) {
			Outlines
				.findAll({
					order: [['id', 'DESC']]
				})
				.then((result: any) => {
					const outlines = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
						const { id, title } = dataValues;
						return { id, title };
					});

					this.setState((prevState: SidebarState) => ({
						...prevState,
						outlines
					}));

					this.props.stopRefreshSidebar();
				})
				.catch((err: any) => {

				});
		}
	}

	componentDidMount = () => {
		Outlines
			.findAll({
				order: [['id', 'DESC']]
			})
			.then((result: any) => {
				const outlines = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
					const { id, title } = dataValues;
					return { id, title };
				});

				this.setState((prevState: SidebarState) => ({
					...prevState,
					outlines
				}));
			})
			.catch((err: any) => {

			});
	}

	select = (e: ClickParam) => {
		this.props.history.push(`/outline/${e.key}`);
	}

	toTutorial = (e: ClickParam) => {
		this.props.history.push('/');
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

		// outline to be selected when first loading the page
		let selected = 'tutorial';
		if (this.props.location.pathname.indexOf('outline') !== -1) {
			selected = this.props.location.pathname.slice(9)
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
					<Menu defaultSelectedKeys={[selected]} defaultOpenKeys={['all']} mode="inline">
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
								this.state.outlines.map((outline: Outline) => (
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
						<SidebarTrash />
					</Menu>
				</Col>
			</section>
		);
	}
}

export default withRouter(Sidebar);
