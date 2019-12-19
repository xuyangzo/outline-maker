import * as React from 'react';
import { Icon, Button, PageHeader, Dropdown, Menu } from 'antd';

// custom components
import CharacterModal from './character-modal/CharacterModal';
import OutlineModal from './outline-modal/OutlineModal';

// enable history
import { withRouter } from 'react-router-dom';

// type decalration
import { NovelHeaderProps, NovelHeaderState } from './novelHeaderDec';

// database operations

// sass
import './novel-header.scss';

class NovelHeader extends React.Component<NovelHeaderProps, NovelHeaderState> {
	constructor(props: NovelHeaderProps) {
		super(props);
		this.state = {
			characterVisible: false,
			outlineVisible: false,
			id: props.id
		};
	}

	// on open create character modal
	onOpenCharacterModal = () => {
		this.setState({ characterVisible: true });
	}

	// on close create character modal
	onCloseCharacterModal = () => {
		this.setState({ characterVisible: false });
		this.props.cancelCreateCharacter();
	}

	// on open create outline modal
	onOpenOutlineModal = () => {
		this.setState({ outlineVisible: true });
	}

	// on close create outline modal
	onCloseOutlineModal = () => {
		this.setState({ outlineVisible: false });
		this.props.cancelCreateOutline();
	}

	componentWillReceiveProps = (props: NovelHeaderProps) => {
		this.setState({
			id: props.id,
			characterVisible: props.createCharacter,
			outlineVisible: props.createOutline
		});
	}

	render() {
		const { refreshCharacter, refreshOutline } = this.props;
		const { characterVisible, outlineVisible, id } = this.state;

		// menu for add drop down
		const addmenu = (
			<Menu>
				<Menu.Item onClick={this.onOpenCharacterModal}>
					<Icon type="user-add" />添加角色
				</Menu.Item>
				<Menu.Item onClick={this.onOpenOutlineModal}>
					<Icon type="file-add" />添加大纲
				</Menu.Item>
			</Menu >
		);

		// menu for edit drop down
		const editmenu = (
			<Menu>
				<Menu.Item>
					<Icon type="profile" />编辑简介
				</Menu.Item>
				<Menu.Item className="delete-outline-menuitem">
					<Icon type="close-circle" />删除大纲
				</Menu.Item>
			</Menu>
		);

		return (
			<React.Fragment>
				<PageHeader
					title={''}
					onBack={() => { this.props.history.go(-1); }}
					extra={[
						<Dropdown key="add" overlay={addmenu} placement="bottomCenter">
							<Button type="primary" key="add-person" ghost>
								<Icon type="folder-add" />添加 ...
							</Button>
						</Dropdown>,
						<Dropdown key="edit" overlay={editmenu} placement="bottomCenter">
							<Button type="danger" className="orange-button" ghost>
								<Icon type="edit" />编辑小说
							</Button>
						</Dropdown>,
						<Button
							key="save"
							type="danger"
							className="green-button"
							ghost
						>
							<Icon type="save" />
						</Button>
					]}
					className="main-header"
				/>
				<CharacterModal
					showModal={characterVisible}
					closeModal={this.onCloseCharacterModal}
					refreshCharacter={refreshCharacter}
					id={id}
				/>
				<OutlineModal
					showModal={outlineVisible}
					closeModal={this.onCloseOutlineModal}
					refreshOutline={refreshOutline}
					id={id}
				/>
			</React.Fragment>
		);
	}
}

export default withRouter(NovelHeader);
