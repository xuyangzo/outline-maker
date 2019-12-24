import * as React from 'react';
import { Icon, Button, PageHeader, Dropdown, Menu } from 'antd';

// custom components
import CharacterModal from './character-modal/CharacterModal';
import OutlineModal from './outline-modal/OutlineModal';
import LocationModal from './location-modal/LocationModal';
import NovelModal from './novel-modal/NovelModal';

// enable history
import { withRouter } from 'react-router-dom';

// type decalration
import { NovelHeaderProps, NovelHeaderState } from './novelHeaderDec';

// sass
import './novel-header.scss';

class NovelHeader extends React.Component<NovelHeaderProps, NovelHeaderState> {
	constructor(props: NovelHeaderProps) {
		super(props);
		this.state = {
			id: props.id,
			characterVisible: false,
			outlineVisible: false,
			locationVisible: false,
			deleteNovelVisible: false
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

	// on open create location modal
	onOpenLocationModal = () => {
		this.setState({ locationVisible: true });
	}

	// on close create location modal
	onCloseLocationModal = () => {
		this.setState({ locationVisible: false });
		this.props.cancelCreateLocation();
	}

	// on open delete novel modal
	onOpenDeleteNovelModal = () => {
		this.setState({ deleteNovelVisible: true });
	}

	// on close delete novel modal
	onCloseDeleteNovelModal = () => {
		this.setState({ deleteNovelVisible: false });
	}

	componentWillReceiveProps = (props: NovelHeaderProps) => {
		this.setState({
			id: props.id,
			characterVisible: props.createCharacter,
			outlineVisible: props.createOutline,
			locationVisible: props.createLocation
		});
	}

	render() {
		const { refreshCharacter, refreshOutline, refreshLocation, refreshSidebar } = this.props;
		const { characterVisible, outlineVisible, locationVisible, deleteNovelVisible, id } = this.state;

		// menu for add drop down
		const addmenu = (
			<Menu>
				<Menu.Item onClick={this.onOpenCharacterModal}>
					<Icon type="user-add" />添加角色
				</Menu.Item>
				<Menu.Item onClick={this.onOpenLocationModal}>
					<Icon type="usergroup-add" />添加势力
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
					<Icon type="profile" />编辑模式
				</Menu.Item>
				<Menu.Item className="delete-outline-menuitem" onClick={this.onOpenDeleteNovelModal}>
					<Icon type="close-circle" />删除小说
				</Menu.Item>
			</Menu>
		);

		return (
			<React.Fragment>
				<PageHeader
					title={''}
					onBack={() => { this.props.history.goBack(); }}
					extra={[
						<Dropdown key="add" overlay={addmenu} placement="bottomCenter">
							<Button type="primary" key="add-person" ghost>
								<Icon type="folder-add" />添加 ...
							</Button>
						</Dropdown>,
						<Dropdown key="edit" overlay={editmenu} placement="bottomCenter">
							<Button type="danger" className="orange-button" ghost>
								<Icon type="edit" />编辑 ...
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
				<LocationModal
					showModal={locationVisible}
					closeModal={this.onCloseLocationModal}
					refreshLocation={refreshLocation}
					id={id}
				/>
				<NovelModal
					showModal={deleteNovelVisible}
					closeModal={this.onCloseDeleteNovelModal}
					refreshSidebar={refreshSidebar}
					id={id}
				/>
			</React.Fragment>
		);
	}
}

export default withRouter(NovelHeader);
