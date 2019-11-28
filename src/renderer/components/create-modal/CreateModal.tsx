import * as React from 'react';
import { CreateModalProps, CreateModalState } from './CreateModalDec';
import { Button, Modal, Form, Input, Icon, message } from 'antd';

const { TextArea } = Input;

import Outlines from '../../../db/models/Outlines';

export default class CreateModal extends React.Component<CreateModalProps, CreateModalState> {
	constructor(props: CreateModalProps) {
		super(props);
		this.state = {
			title: '',
			description: ''
		};
	}

	handleSubmit = () => {
		Outlines
			.create({
				title: this.state.title,
				description: this.state.description
			})
			.then(() => {
				message.success('创建大纲成功！');
				// close modal
				this.props.closeModal();
				// refresh sidebar
				this.props.refreshSidebar();
				// clear modal data
				this.setState({
					title: '',
					description: ''
				});
			})
			.catch((err: any) => {
				console.log(err);
			});
	}

	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const title = event.target.value;
		this.setState((prevState: CreateModalState) => ({
			...prevState,
			title
		}));
	}

	onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const description = event.target.value;
		this.setState((prevState: CreateModalState) => ({
			...prevState,
			description
		}));
	}

	render() {
		const { showModal, closeModal } = this.props;

		const { title, description } = this.state;

		return (
			<Modal
				title="创建新的大纲"
				visible={showModal}
				onOk={this.handleSubmit}
				onCancel={closeModal}
				footer={[
					<Button type="danger" key="back" onClick={closeModal} ghost>取消</Button>,
					<Button type="primary" key="submit" onClick={this.handleSubmit} ghost>确认</Button>
				]}
			>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<Form.Item>
						<Input
							value={title}
							onChange={this.onChange}
							prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="大纲名字"
						/>
					</Form.Item>
					<Form.Item>
						<TextArea
							value={description}
							onChange={this.onTextAreaChange}
							autoSize={
								{ minRows: 6, maxRows: 6 }
							}
							placeholder="简单描述，不超过100字"
						/>
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}
