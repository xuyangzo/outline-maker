import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';
const { TextArea } = Input;

// type declaration
import { CreateModalTemplate } from '../../create-modal/createModalDec';
import { IntroModalProps, IntroModalState } from './introModalDec';
import { ValidationErrorItem, DatabaseError } from 'sequelize';

// sequelize modals
import Outlines from '../../../../db/models/Outlines';

class IntroModal extends React.Component<IntroModalProps, IntroModalState> {
	constructor(props: IntroModalProps) {
		super(props);
		this.state = {
			title: props.title,
			description: props.description
		};
	}

	componentWillReceiveProps = (props: IntroModalProps) => {
		this.setState({
			title: props.title,
			description: props.description
		});
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
			.update(
				model,
				{ where: { id: this.props.id } }
			)
			.then(() => {
				Message.success('修改大纲成功！');
				// close modal
				this.props.closeModal();
				// refresh sidebar
				this.props.refreshSidebar();
				// refresh main
				this.props.refreshMain();
				// clear modal data
				this.setState({
					title: '',
					description: ''
				});
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
		this.setState((prevState: IntroModalState) => ({
			...prevState,
			title
		}));
	}

	// the event of textarea change is different, so use a separate method
	onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const description = event.target.value;
		this.setState((prevState: IntroModalState) => ({
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
				title="修改大纲简介"
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

export default IntroModal;
