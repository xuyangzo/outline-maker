import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';

// database operations
import { createLocation } from '../../../../db/operations/location-ops';

// type declaration
import { LocationModalProps, LocationModalState } from './locationModalDec';
import { DatabaseError } from 'sequelize';

class LocationModal extends React.Component<LocationModalProps, LocationModalState> {
	constructor(props: LocationModalProps) {
		super(props);
		this.state = {
			name: ''
		};
	}

	handleSubmit = () => {
		// novel_id, outline_id, name, color
		createLocation(this.props.id, this.state)
			.then(() => {
				// alert success
				Message.success('势力创建成功！');
				// refresh character
				this.props.refreshLocation(this.props.id);
				// close modal
				this.props.closeModal();
				// clear modal data
				this.setState({
					name: ''
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// on input change
	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const name = event.target.value;
		this.setState({ name });
	}

	// close current modal
	closeModal = () => {
		this.props.closeModal();
		// clear content
		this.setState({ name: '' });
	}

	render() {
		const { showModal } = this.props;
		const { name } = this.state;

		return (
			<Modal
				title="新建势力"
				visible={showModal}
				onOk={this.handleSubmit}
				onCancel={this.closeModal}
				footer={[
					<Button type="danger" key="back" onClick={this.closeModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={this.handleSubmit}
						ghost
					>确认
					</Button>
				]}
			>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<Form.Item>
						<Input
							value={name}
							onChange={this.onChange}
							prefix={<Icon type="user-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="势力名字（最多 20 个字）"
							ref={(input: Input) => input && input.focus()}
						/>
						更多的势力设定可以在添加势力后进行设置。
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default LocationModal;
