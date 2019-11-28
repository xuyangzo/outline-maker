import * as React from 'react';
import { SidebarProps, SidebarState, OutlineDataValue, Outline } from './sidebarDec';
import { Col, Menu, Icon } from 'antd';
import classnames from 'classnames';

const { SubMenu } = Menu;

import SidebarTrash from './trash/SidebarTrash';

import './sidebar.scss';

require('../../../db/relations');
import Outlines from '../../../db/models/Outlines';

export default class Sidebar extends React.Component<SidebarProps, SidebarState> {
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

	render() {
		const {
			expand,
			growSidebar,
			shrinkSidebar,
			createOutline
		} = this.props;

		const arrow: string = expand ? 'double-left' : 'double-right';
		const action: () => void = expand ? shrinkSidebar : growSidebar;

		return (
			<section id="sidebar" className="sidebar">
				<Col
					span={5}
					className={classnames('sidebar-menu', {
						'sidebar-shrink': !expand
					})}
				>
					<aside className="toggle-sidebar" onClick={action}>
						<Icon type={arrow} />
					</aside>
					<button className="add-outline-button" onClick={createOutline}>
						<Icon type="plus-circle" />&nbsp;&nbsp;&nbsp;添加大纲
					</button>
					<Menu defaultSelectedKeys={['default-template']} defaultOpenKeys={['all']} mode="inline">
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
									<Menu.Item key={outline.id}>{outline.title}</Menu.Item>
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
