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
			deleteModal: false,
			showColorPalette: false
		};
	}

	// show edit icon
	onShowEditIcon = () => {
		this.setState({ showEdit: true });
	}

	// hide edit icon
	onHideEditIcon = () => {
		this.setState({ showEdit: false, showToolbar: false, showColorPalette: false });
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

	// show color palette
	onShowColorPalette = () => {
		this.setState({ showColorPalette: true });
	}

	// hide color palette
	onHideColorPalette = () => {
		this.setState({ showColorPalette: false });
	}

	render() {
		const { name, id, onCharacterNameChange, color, setColorLocally } = this.props;
		const { showEdit, showToolbar, deleteModal, showColorPalette } = this.state;
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
							<div
								style={{ position: 'relative' }}
								onMouseEnter={this.onShowColorPalette}
								onMouseLeave={this.onHideColorPalette}
							>
								<Icon type="bg-colors" /> &nbsp;设置颜色
								{
									showColorPalette && (
										<div className="color-palette">
											<div
												className="color-circle"
												style={{ backgroundColor: '#ffa39e' }}
												onClick={() => { setColorLocally(id, '#ffa39e'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#ffbb96' }}
												onClick={() => { setColorLocally(id, '#ffbb96'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#ffe7ba' }}
												onClick={() => { setColorLocally(id, '#ffe7ba'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#fff1b8' }}
												onClick={() => { setColorLocally(id, '#fff1b8'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#d9f7be' }}
												onClick={() => { setColorLocally(id, '#d9f7be'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#b5f5ec' }}
												onClick={() => { setColorLocally(id, '#b5f5ec'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#bae7ff' }}
												onClick={() => { setColorLocally(id, '#bae7ff'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#efdbff' }}
												onClick={() => { setColorLocally(id, '#efdbff'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#ffd6e7' }}
												onClick={() => { setColorLocally(id, '#ffd6e7'); }}
											/>
											<div
												className="color-circle"
												style={{ backgroundColor: '#e8e8e8' }}
												onClick={() => { setColorLocally(id, '#e8e8e8'); }}
											/>
										</div>
									)
								}
							</div>
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
