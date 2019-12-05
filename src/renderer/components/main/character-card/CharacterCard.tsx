import * as React from 'react';
import { Icon, Modal, Button } from 'antd';

// type declaration
import { CharacterCardProps, CharacterCardState } from './characterCardDec';

// sass
import './character-card.scss';

class CharacterCard extends React.Component<CharacterCardProps, CharacterCardState> {
	constructor(props: CharacterCardProps) {
		super(props);
		this.state = {
			showEdit: false,
			showToolbar: false,
			deleteModal: false
		};
	}

	// show edit icon
	onShowEditIcon = () => {
		this.setState({ showEdit: true });
	}

	// hide edit icon
	onHideEditIcon = () => {
		this.setState({ showEdit: false, showToolbar: false });
	}

	// show toolbar
	onShowToolbar = () => {
		this.setState({ showToolbar: true });
	}

	// hide toolbar
	onHideToolbar = () => {
		this.setState({ showToolbar: false });
	}

	// open delete modal
	onOpenDelete = () => {
		this.setState({ deleteModal: true });
	}

	// cancel delete modal
	onCancelDelete = () => {
		this.setState({ deleteModal: false });
	}

	// delete character locally
	onDelete = () => {
		this.props.deleteCharacterLocally(this.props.id);
		this.setState({ deleteModal: false, showToolbar: false });
	}

	render() {
		const { name, id, onCharacterNameChange, color } = this.props;
		const { showEdit, showToolbar, deleteModal } = this.state;
		return (
			<th
				className="character-header"
				onMouseEnter={this.onShowEditIcon}
				onMouseLeave={this.onHideEditIcon}
			>
				{
					showEdit && (
						<Icon type="setting" className="character-setting-icon" onClick={this.onShowToolbar} />
					)
				}
				{
					showToolbar && (
						<div className="character-toolbar">
							<div onClick={this.onOpenDelete}><Icon type="close" /> &nbsp;删除人物</div>
							<div><Icon type="star" /> &nbsp;设为主角</div>
							<div><Icon type="bg-colors" /> &nbsp;设置颜色</div>
						</div>
					)
				}
				<Modal
					title="删除人物确认"
					visible={deleteModal}
					onOk={this.onDelete}
					onCancel={this.onCancelDelete}
					footer={[
						<Button type="danger" key="back" onClick={this.onCancelDelete} ghost>取消</Button>,
						<Button type="primary" key="submit" onClick={this.onDelete} ghost>确认</Button>
					]}
				>
					<p>删除人物会将其所有事迹都删除！确认要删除吗？</p>
				</Modal>
				<div
					className="main-character-card"
					style={{ backgroundColor: color }}
				>
					<input
						type="text"
						value={name}
						style={{ backgroundColor: color }}
						onChange={
							(e: React.ChangeEvent<HTMLInputElement>) => onCharacterNameChange(id, e)
						}
					/>
				</div>
			</th>
		);
	}
}

export default CharacterCard;
