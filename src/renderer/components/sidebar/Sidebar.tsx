import * as React from 'react';
import { Col, Menu, Icon, message as Message, Modal, Form, Input, Button, Row } from 'antd';
import classnames from 'classnames';
const { SubMenu } = Menu;
const { TextArea } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type decalaration
import { SidebarProps, SidebarState, NovelSidebarDataValue, CreateNovelModalTemplate } from './sidebarDec';
import { DatabaseError } from 'sequelize';
import { ClickParam } from 'antd/lib/menu';

// database operation
import { getAllNovels, createNovel } from '../../../db/operations/novel-ops';

// utils
import { getSelectedKey } from '../../utils/utils';

// sass
import './sidebar.scss';

// image
import logo from '../../../public/icons/png/icon-512@2x.png';

class Sidebar extends React.Component<SidebarProps, SidebarState> {
	constructor(props: SidebarProps) {
		super(props);
		this.state = {
			selected: [],
			novels: [],
			showModal: false,
			createdName: '',
			createdDescription: ''
		};
	}

	componentWillReceiveProps = (newProps: SidebarProps) => {
		// set selected keys
		this.setSelectedKey(newProps);
		// if need to refresh, refresh
		if (newProps.refresh) {
			this.getNovels();
			/**
			 * need to set refresh flag to false
			 * otherwise will always refresh when receive new props
			 */
			newProps.stopRefreshSidebar();
		}
	}

	componentDidMount = () => {
		// set selected keys
		this.setSelectedKey(this.props);
		// get all outlines
		this.getNovels();
	}

	// once a menu is selected
	onSelect = ({ key }: { key: string }) => {
		this.setState({ selected: [key] });
	}

	// open create novel modal
	onOpenModal = () => {
		this.setState({ showModal: true });
	}

	// close create novel modal
	onCloseModal = () => {
		this.setState({ showModal: false, createdName: '', createdDescription: '' });
	}

	// name input field chanage
	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const createdName = event.target.value;
		this.setState({ createdName });
	}

	// the event of textarea change is different, so use a separate method
	onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const createdDescription = event.target.value;
		this.setState({ createdDescription });
	}

	// once a menu is selected, forward to corresponding outline page
	select = (e: ClickParam) => {
		this.props.history.push(e.key);
	}

	// get selected key
	setSelectedKey = (props: SidebarProps) => {
		// set selected keys
		this.setState({ selected: [getSelectedKey(props.location.pathname)] });
	}

	// get all novels
	getNovels = () => {
		// get all novels
		getAllNovels()
			.then((novels: NovelSidebarDataValue[]) => {
				this.setState({ novels });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// create new novel
	handleSubmit = () => {
		const { createdName, createdDescription } = this.state;
		/**
		 * if the user does not enter anything for description
		 * do not include it in the object
		 * so that the defaultValue of sequelize modal will be used
		 */
		const model: CreateNovelModalTemplate = {
			name: createdName
		};
		if (this.state.createdDescription.length) {
			model.description = createdDescription;
		}

		// create outline
		createNovel(model)
			.then((result: WriteDataModel) => {
				// alert success
				Message.success('创建小说成功！');
				// close modal
				this.onCloseModal();
				// refresh sidebar
				this.getNovels();
				// redirect to created novel page
				if (result.id) this.props.history.push(`/novel/${result.id}`);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand, growSidebar, shrinkSidebar } = this.props;
		const { showModal, createdName, createdDescription } = this.state;

		// sets the toggle action of sidebar
		const arrow: string = expand ? 'double-left' : 'double-right';
		const action: () => void = expand ? shrinkSidebar : growSidebar;

		return (
			<section id="sidebar" className="sidebar">
				<Col
					span={5}
					className={classnames('sidebar-menu', {
						'sidebar-shrink': !expand
					})}
				>
					<Modal
						title="创建新的小说"
						visible={showModal}
						onOk={this.handleSubmit}
						onCancel={this.onCloseModal}
						footer={[
							<Button type="danger" key="back" onClick={this.onCloseModal} ghost>取消</Button>,
							<Button type="primary" key="submit" onClick={this.handleSubmit} ghost>确认</Button>
						]}
					>
						<Form onSubmit={this.handleSubmit} className="login-form">
							<Form.Item>
								<Input
									value={createdName}
									onChange={this.onChange}
									prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="小说名字（12个字以内）"
									autoFocus
								/>
							</Form.Item>
							<Form.Item>
								<TextArea
									value={createdDescription}
									onChange={this.onTextAreaChange}
									autoSize={
										{ minRows: 6, maxRows: 6 }
									}
									placeholder="小说简介，不超过300字"
								/>
							</Form.Item>
						</Form>
					</Modal>
					<aside
						className={classnames('toggle-sidebar', {
							'toggle-sidebar-moveleft': !expand
						})}
						onClick={action}
					>
						<Icon type={arrow} />
					</aside>
					<div className="sidebar-info">
						<img src={logo} alt="logo" className="sidebar-logo" />
						<div className="app-intro">
							<h4>朝思</h4>
							<p>作者：Lynch</p>
						</div>
					</div>
					<button className="add-outline-button" onClick={this.onOpenModal}>
						<Icon type="plus-circle" />&nbsp;&nbsp;&nbsp;新建小说
					</button>
					<Menu
						defaultSelectedKeys={['tutorial']}
						selectedKeys={this.state.selected}
						defaultOpenKeys={['novel']}
						mode="inline"
						onSelect={this.onSelect}
					>
						<Menu.Item key="tutorial" onClick={() => { this.props.history.push('/'); }}>
							<Icon type="question-circle" />教程
						</Menu.Item>
						<SubMenu
							key="novel"
							title={
								(
									<span>
										<Icon type="book" />
										<span>全部小说</span>
									</span>
								)
							}
						>
							{
								this.state.novels.map((novel: NovelSidebarDataValue) => (
									<SubMenu key={novel.id} title={novel.name}>
										<Menu.Item key={`/novel/${novel.id}`} onClick={this.select}>小说介绍</Menu.Item>
										<Menu.Item key={`/background/${novel.id}`} onClick={this.select}>背景设定</Menu.Item>
										<Menu.Item key={`/characters/${novel.id}`} onClick={this.select}>人物列表</Menu.Item>
										<Menu.Item key={`/locations/${novel.id}`} onClick={this.select}>势力列表</Menu.Item>
										<Menu.Item key={`/outlines/${novel.id}`} onClick={this.select}>大纲列表</Menu.Item>
									</SubMenu>
								))
							}
						</SubMenu>
						<Menu.Item key="fav" onClick={() => { this.props.history.push('/favorite'); }}>
							<Icon type="heart" />收藏夹
						</Menu.Item>
						<Menu.Item key="draft">
							<Icon type="file" />草稿箱
						</Menu.Item>
						<Menu.Item key="trash" onClick={() => { this.props.history.push('/trash'); }}>
							<Icon type="delete" />垃圾箱
						</Menu.Item>
					</Menu>
				</Col>
			</section>
		);
	}
}

export default withRouter(Sidebar);
