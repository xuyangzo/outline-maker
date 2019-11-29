import * as React from 'react';
import { MainHeaderProps, MainHeaderState } from './mainHeaderDec';
import { Icon, Button, PageHeader, message as Message, Modal } from 'antd';
import { withRouter } from 'react-router-dom';

import Outlines from '../../../db/models/Outlines';
import Trash from '../../../db/models/Trash';

class MainHeader extends React.Component<MainHeaderProps, MainHeaderState> {
	constructor(props: MainHeaderProps) {
		super(props);
		this.state = {
			confirmVisible: false
		};
	}

	onOpen = () => {
		this.setState({ confirmVisible: true });
	}

	onCancel = () => {
		this.setState({ confirmVisible: false });
	}

	onDelete = () => {
		const id: string = this.props.location.pathname.slice(9);
		Promise
			.all([
				Outlines
					.update(
						{ deleted: 1 },
						{ where: { id } }
					),
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
			.catch((err: any) => {
				console.log(err);
			});
	}

	render() {
		const { title, description } = this.props;

		return (
			<React.Fragment>
				<PageHeader
					title={title}
					subTitle={description}
					backIcon={false}
					extra={[
						<Button type="primary" key="add-person" ghost><Icon type="user-add" />添加人物</Button>,
						<Button type="danger" key="delete" onClick={this.onOpen} ghost>删除大纲</Button>
					]}
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
