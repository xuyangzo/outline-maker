import * as React from 'react';
import { SidebarTrashProps, SidebarTrashState } from '../sidebarDec';
import { Menu, Icon } from 'antd';
import classnames from 'classnames';

const { SubMenu } = Menu;

export default class Trash extends React.Component<SidebarTrashProps, SidebarTrashState> {
	constructor(props: SidebarTrashProps) {
		super(props);
	}

	componentDidMount = () => {

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
				<Menu.Item key="trash-1">Option 5</Menu.Item>
				<Menu.Item key="trash-2">Option 6</Menu.Item>
			</SubMenu>
		);
	}
}
