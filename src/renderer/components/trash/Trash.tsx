import * as React from 'react';
import { Col, message as Message, Collapse, Button, Modal } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import NovelTrash from './novel-trash/NovelTrash';
import CharacterTrash from './character-trash/CharacterTrash';
import OutlineTrash from './outline-trash/OutlineTrash';
import LocationTrash from './location-trash/LocationTrash';

// type declaration
import { TrashProps, TrashState, TrashDataValue } from './TrashDec';

// database operations
import { getAllTrashes } from '../../../db/operations/trash-ops';

// sass
import './trash.scss';

// image
import empty from '../../../public/empty-trash.png';

class Trash extends React.Component<TrashProps, TrashState> {
	constructor(props: TrashProps) {
		super(props);
		this.state = {
			novels: [],
			outlines: [],
			characters: [],
			locations: [],
			shouldRender: false,
			batchDelete: false,
			showClearModal: false
		};
	}

	componentDidMount = () => {
		this.getTrashes();
	}

	// get all trashes
	getTrashes = () => {
		getAllTrashes()
			.then((result: TrashDataValue) => {
				const { novels, outlines, characters, locations } = result;
				this.setState({ novels, outlines, characters, locations, shouldRender: true });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// open clear modal
	onOpenClearModal = () => {
		this.setState({ showClearModal: true });
	}

	// close clear modal
	onCloseClearModal = () => {
		this.setState({ showClearModal: false });
	}

	// start batch deletion
	onBatchDelete = () => {
		this.setState({ batchDelete: true, showClearModal: false });
	}

	render() {
		const { expand, refreshSidebar } = this.props;
		const { shouldRender, novels, outlines, characters, locations, batchDelete, showClearModal } = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('trash', {
						'main-grow': !expand
					})
				}
			>
				{
					(novels.length || outlines.length || characters.length || locations.length) && shouldRender ?
						(
							<Button
								type="danger"
								ghost
								className="trash-clear-all-button"
								onClick={this.onOpenClearModal}
							>清空回收箱
							</Button>
						) : ''
				}
				{
					!novels.length && !outlines.length && !characters.length && !locations.length && shouldRender && (
						<div className="empty-trash">
							<h2>垃圾箱是空的哟...</h2>
							<br />
							<img src={empty} alt="empty trash" />
						</div>
					)
				}
				<Collapse defaultActiveKey={['novels', 'characters', 'locations', 'outlines']}>
					{
						novels.length && shouldRender && (
							<Panel header="小说列表" key="novels">
								<NovelTrash
									novels={novels}
									refresh={this.getTrashes}
									refreshSidebar={refreshSidebar}
									batchDelete={batchDelete}
								/>
							</Panel>
						)
					}
					{
						characters.length && shouldRender && (
							<Panel header="角色列表" key="characters">
								<CharacterTrash
									characters={characters}
									refresh={this.getTrashes}
									batchDelete={batchDelete}
								/>
							</Panel>
						)
					}
					{
						locations.length && shouldRender && (
							<Panel header="势力列表" key="locations">
								<LocationTrash
									locations={locations}
									refresh={this.getTrashes}
									batchDelete={batchDelete}
								/>
							</Panel>
						)
					}
					{
						outlines.length && shouldRender && (
							<Panel header="大纲列表" key="outlines">
								<OutlineTrash
									outlines={outlines}
									refresh={this.getTrashes}
									batchDelete={batchDelete}
								/>
							</Panel>
						)
					}
				</Collapse>
				<Modal
					title="清空回收箱"
					visible={showClearModal}
					onOk={this.onBatchDelete}
					onCancel={this.onCloseClearModal}
					footer={[
						<Button type="danger" key="back" onClick={this.onCloseClearModal} ghost>取消</Button>,
						<Button
							type="primary"
							key="submit"
							onClick={this.onBatchDelete}
							ghost
						>确认
						</Button>
					]}
				>
					清空回收箱后，数据无法恢复！是否继续？
				</Modal>
			</Col>
		);
	}
}

export default withRouter(Trash);
