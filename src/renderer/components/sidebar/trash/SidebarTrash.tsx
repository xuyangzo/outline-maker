import * as React from 'react';
import { SidebarTrashProps, SidebarTrashState } from './sidebarTrashDec';
import { Outline } from '../sidebarDec';
import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;

export default class Trash extends React.Component<SidebarTrashProps, SidebarTrashState> {
	constructor(props: SidebarTrashProps) {
		super(props);
	}
	render() {
		const { ...other } = this.props;

		return (
			<SubMenu
				key="trash"
				title={
					<span>
						<Icon type="delete" />
						<span>垃圾箱</span>
					</span>
				}
				{...other}
			>
				{
					this.props.outlines.map((outline: Outline) => (
						<Menu.Item key={outline.id}>{outline.title}</Menu.Item>
					))
				}
			</SubMenu>
		);
	}
}
