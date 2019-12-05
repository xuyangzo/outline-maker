import * as React from 'react';
import { Icon, Modal, Button, Divider } from 'antd';

// type declaration
import { TimelineCardProps, TimelineCardState } from './timelineCardDec';

// sass
import './timeline-card.scss';

class TimelineCard extends React.Component<TimelineCardProps, TimelineCardState> {
	constructor(props: TimelineCardProps) {
		super(props);
		this.state = {
			showEdit: false,
			deleteModal: false
		};
	}

	// show edit icon
	onShowEditIcon = () => {
		this.setState({ showEdit: true });
	}

	// hide edit icon
	onHideEditIcon = () => {
		this.setState({ showEdit: false });
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
		this.props.deleteTimelineLocally(this.props.id);
		this.onCancelDelete();
	}

	render() {
		const { time, id, onTimelineChange, isFirst } = this.props;
		const { showEdit, deleteModal } = this.state;

		return (
			<td
				className="timeline-header"
				onMouseEnter={this.onShowEditIcon}
				onMouseLeave={this.onHideEditIcon}
				style={{ paddingTop: isFirst ? '50px' : '0' }}
			>
				<Modal
					title="删除时间线确认"
					visible={deleteModal}
					onOk={this.onDelete}
					onCancel={this.onCancelDelete}
					footer={[
						<Button type="danger" key="back" onClick={this.onCancelDelete} ghost>取消</Button>,
						<Button type="primary" key="submit" onClick={this.onDelete} ghost>确认</Button>
					]}
				>
					<p>删除时间线会将所有该时间线的事迹都删除！确认要删除吗？</p>
				</Modal>
				<div className="timeline-component-after">
					{
						showEdit && (
							<Icon
								type="close"
								className="timeline-setting-icon"
								onClick={this.onOpenDelete}
								style={{ top: isFirst ? '10px' : '0px' }}
							/>
						)
					}
					<input
						type="text"
						value={time}
						onChange={
							(e: React.ChangeEvent<HTMLInputElement>) => onTimelineChange(id, e)
						}
					/>
				</div>
			</td>
		);
	}
}

export default TimelineCard;
