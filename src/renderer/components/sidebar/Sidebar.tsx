import * as React from 'react';
import { SidebarProps, SidebarState } from './sidebarDec';
import { Col, Menu, Icon } from 'antd';
import classnames from 'classnames';

const { SubMenu } = Menu;

require('./sidebar.scss');

// const IconFont = Icon.createFromIconfontCN({
// 	scriptUrl: '//at.alicdn.com/t/font_1531781_n3f5v9yel4c.js',
// });

export default class Sidebar extends React.Component<SidebarProps, SidebarState> {
	constructor(props: SidebarProps) {
		super(props);
	}

	render() {
		const { expand, growSidebar, shrinkSidebar } = this.props;

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
					<Menu defaultSelectedKeys={['all-1']} defaultOpenKeys={['all']} mode="inline">
						<SubMenu
							key="all"
							title={
								<span>
									<Icon type="file-text" />
									<span>全部大纲</span>
								</span>
							}
						>
							<Menu.Item key="all-1">Option 5</Menu.Item>
							<Menu.Item key="all-2">Option 6</Menu.Item>
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
						<SubMenu
							key="trash"
							title={
								<span>
									<Icon type="delete" />
									<span>垃圾箱</span>
								</span>
							}
						>
							<Menu.Item key="trash-1">Option 5</Menu.Item>
							<Menu.Item key="trash-2">Option 6</Menu.Item>
						</SubMenu>
					</Menu>
				</Col>
			</section>
		);
	}
}
