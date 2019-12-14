import * as React from 'react';
import {
	Icon, Button, PageHeader, message as Message,
	Modal, Dropdown, Menu, Tooltip
} from 'antd';

// custom components

// enable history
import { withRouter } from 'react-router-dom';

// type decalration
import { NovelHeaderProps, NovelHeaderState } from './novelHeaderDec';
import { DatabaseError } from 'sequelize';

// database operations

// sass
import './novel-header.scss';

class NovelHeader extends React.Component<NovelHeaderProps, NovelHeaderState> {
	constructor(props: NovelHeaderProps) {
		super(props);
		this.state = {
			confirmVisible: false,
			characterVisible: false,
			timelineVisible: false,
			introVisible: false,
			isFav: false
		};
	}

	componentWillReceiveProps = (newProps: NovelHeaderProps) => {
		const id: string = newProps.location.pathname.slice(7);
	}

	componentDidMount = () => {
		const id: string = this.props.location.pathname.slice(7);
	}

	render() {

		// menu for add drop down
		const addmenu = (
			<Menu>
				<Menu.Item>
					<Icon type="user-add" />添加角色
				</Menu.Item>
				<Menu.Item>
					<Icon type="clock-circle" />添加时间
				</Menu.Item>
			</Menu>
		);

		// menu for edit drop down
		const editmenu = (
			<Menu>
				<Menu.Item>
					<Icon type="profile" />编辑简介
				</Menu.Item>
				<Menu.Item className="delete-outline-menuitem">
					<Icon type="close-circle" />删除大纲
				</Menu.Item>
			</Menu>
		);

		return (
			<React.Fragment>
				<PageHeader
					title={''}
					backIcon={false}
					// tags={<MyIcon />}
					extra={[
						<Dropdown key="add" overlay={addmenu} placement="bottomCenter">
							<Button type="primary" key="add-person" ghost>
								<Icon type="folder-add" />新建
							</Button>
						</Dropdown>,
						<Dropdown key="edit" overlay={editmenu} placement="bottomCenter">
							<Button type="danger" className="orange-button" ghost>
								<Icon type="edit" />编辑小说
							</Button>
						</Dropdown>,
						<Button
							key="save"
							type="danger"
							className="green-button"
							ghost
						>
							<Icon type="save" />
						</Button>
					]}
					className="main-header"
				/>
			</React.Fragment>
		);
	}
}

export default withRouter(NovelHeader);
