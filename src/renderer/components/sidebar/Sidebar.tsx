import * as React from 'react';
import { Col, Menu, Icon, message as Message, Modal, Form, Input, Button } from 'antd';
import classnames from 'classnames';
const { SubMenu } = Menu;
const { TextArea } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type decalaration
import { SidebarProps, SidebarState, NovelDataValue, Novel, CreateNovelModalTemplate } from './sidebarDec';
import { DatabaseError } from 'sequelize';
import { ClickParam } from 'antd/lib/menu';

// database operation
import { getAllNovels, createNovel } from '../../../db/operations/novel-ops';

// utils
import { getSelectedKey } from '../../utils/utils';

// sidebar
import './sidebar.scss';

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
		if (newProps.refresh) this.getNovels();
	}

	componentDidMount = () => {
		// set selected keys
		this.setSelectedKey(this.props);
		// get all outlines
		this.getNovels();
	}

	// once a menu is selected
	onSelect = ({ key }: { key: string }) => {
		this.setState((prevState: SidebarState) => ({
			...prevState,
			selected: [key]
		}));
	}

	// open create novel modal
	onOpenModal = () => {
		this.setState({ showModal: true });
	}

	// close create novel modal
	onCloseModal = () => {
		this.setState({ showModal: false });
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
		this.props.history.push(`/novel/${e.key}`);
	}

	// get selected key
	setSelectedKey = (props: SidebarProps) => {
		// set selected keys
		this.setState((prevState: SidebarState) => ({
			...prevState,
			selected: [getSelectedKey(props.location.pathname)]
		}));
	}

	// get all novels
	getNovels = () => {
		// get all novels
		getAllNovels()
			.then((result: any) => {
				const novels: Novel[] = result.map(({ dataValues }: { dataValues: NovelDataValue }) => {
					const { id, name, description } = dataValues;
					return { id, name, description };
				});
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
			.then(({ 'null': id }: { 'null': number }) => {
				Message.success('创建小说成功！');
				// close modal
				this.onCloseModal();
				// refresh sidebar
				this.getNovels();
				// redirect to created novel page
				this.props.history.push(`/novel/${id}`);
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

		// sets default selected
		let selected = 'tutorial';
		if (this.props.location.pathname.indexOf('outline') !== -1) {
			selected = this.props.location.pathname.slice(9);
		}

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
					{/* <button className="add-outline-button" onClick={createOutline}>
						<Icon type="plus-circle" />&nbsp;&nbsp;&nbsp;创建大纲
					</button> */}
					<button className="add-outline-button" onClick={this.onOpenModal}>
						<Icon type="plus-circle" />&nbsp;&nbsp;&nbsp;新建小说
					</button>
					<Menu
						defaultSelectedKeys={[selected]}
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
								this.state.novels.map((novel: Novel) => (
									<Menu.Item key={novel.id} onClick={this.select}>{novel.name}</Menu.Item>
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
