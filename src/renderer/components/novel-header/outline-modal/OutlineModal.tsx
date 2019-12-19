import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';
const { TextArea } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { OutlineModalProps, OutlineModalState, OutlineModalTemplate } from './outlineModalDec';
import { DatabaseError } from 'sequelize';

// database operations
import { createOutline } from '../../../../db/operations/outline-ops';

class OutlineModal extends React.Component<OutlineModalProps, OutlineModalState> {
	constructor(props: OutlineModalProps) {
		super(props);
		this.state = {
			title: '',
			description: ''
		};
	}

	handleSubmit = () => {
		/**
		 * if the user does not enter anything for description
		 * do not include it in the object
		 * so that the defaultValue of sequelize modal will be used
		 */
		const model: OutlineModalTemplate = {
			title: this.state.title,
			novel_id: this.props.id
		};
		if (this.state.description.length) {
			model.description = this.state.description;
		}

		// create outline
		createOutline(model)
			.then(() => {
				// alert success
				Message.success('创建大纲成功！');
				// refresh outlines
				this.props.refreshOutline(this.props.id);
				// close modal
				this.props.closeModal();
				// clear modal data
				this.setState({
					title: '',
					description: ''
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	// when input field changes
	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const title = event.target.value;
		this.setState({ title });
	}

	// the event of textarea change is different, so use a separate method
	onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const description = event.target.value;
		this.setState({ description });
	}

	closeModal = () => {
		this.props.closeModal();
		// clear content
		this.setState({
			title: '',
			description: ''
		});
	}

	render() {
		const { showModal } = this.props;
		const { title, description } = this.state;

		return (
			<Modal
				title="创建新的大纲"
				visible={showModal}
				onOk={this.handleSubmit}
				onCancel={this.closeModal}
				footer={[
					<Button type="danger" key="back" onClick={this.closeModal} ghost>取消</Button>,
					<Button type="primary" key="submit" onClick={this.handleSubmit} ghost>确认</Button>
				]}
			>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<Form.Item>
						<Input
							value={title}
							onChange={this.onChange}
							prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="大纲名字（10个字以内）"
							autoFocus
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

export default withRouter(OutlineModal);
