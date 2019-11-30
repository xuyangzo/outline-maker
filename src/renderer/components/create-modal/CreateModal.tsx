import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';
const { TextArea } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { CreateModalProps, CreateModalState, CreateModalTemplate } from './CreateModalDec';
import { ValidationErrorItem } from 'sequelize';

// sequelize modals
import Outlines from '../../../db/models/Outlines';

class CreateModal extends React.Component<CreateModalProps, CreateModalState> {
	constructor(props: CreateModalProps) {
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
		const model: CreateModalTemplate = {
			title: this.state.title
		};
		if (this.state.description.length) {
			model.description = this.state.description;
		}

		// create outline
		Outlines
			.create(model)
			.then(({ 'null': id }: { 'null': number }) => {
				Message.success('创建大纲成功！');
				// close modal
				this.props.closeModal();
				// refresh sidebar
				this.props.refreshSidebar();
				// clear modal data
				this.setState({
					title: '',
					description: ''
				});
				// redirect to created outline page
				this.props.history.push(`/outline/${id}`);
			})
			.catch(({ errors }: { errors: ValidationErrorItem[] }) => {
				// iterate through all error messages
				errors.forEach((error: ValidationErrorItem) => {
					const { message } = error;
					Message.error(message);
				});
			});
	}

	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const title = event.target.value;
		this.setState((prevState: CreateModalState) => ({
			...prevState,
			title
		}));
	}

	// the event of textarea change is different, so use a separate method
	onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const description = event.target.value;
		this.setState((prevState: CreateModalState) => ({
			...prevState,
			description
		}));
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
							ref={(input: Input) => input && input.focus()}
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

export default withRouter(CreateModal);
