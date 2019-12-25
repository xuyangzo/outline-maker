import * as React from 'react';
import { Icon, Button, PageHeader, Dropdown, Menu, Modal } from 'antd';

// custom components
import CharacterModal from './character-modal/CharacterModal';
import OutlineModal from './outline-modal/OutlineModal';
import LocationModal from './location-modal/LocationModal';
import NovelModal from './novel-modal/NovelModal';

// enable history
import { withRouter } from 'react-router-dom';

// type decalration
import { NovelHeaderProps } from './novelHeaderDec';

// sass
import './novel-header.scss';

const NovelHeader = (props: NovelHeaderProps) => {
	const {
		createCharacter, createLocation, createOutline,
		cancelCreateCharacter, cancelCreateLocation, cancelCreateOutline,
		refreshCharacter, refreshOutline, refreshLocation, refreshSidebar,
		id, isEdit, enterEditMode, quitEditMode, batchDelete, resetBatchDelete
	} = props;

	// hooks to control the modal
	const [characterVisible, setCharacterModal] = React.useState<boolean>(createCharacter);
	const [locationVisible, setLocationModal] = React.useState<boolean>(createLocation);
	const [outlineVisible, setOutlineModal] = React.useState<boolean>(createOutline);
	const [deleteNovelVisible, setDeleteNovelModal] = React.useState<boolean>(false);
	const [batchDeleteVisible, setBatchDeleteModal] = React.useState<boolean>(false);
	React.useEffect(
		() => {
			setCharacterModal(createCharacter);
			setLocationModal(createLocation);
			setOutlineModal(createOutline);
		},
		[props.id, props.createCharacter, props.createLocation, props.cancelCreateOutline]
	);

	// top right buttons
	function extra(): React.ReactElement<{}>[] {
		if (isEdit) {
			// extra components for non-edit mode
			return [
				(
					<Button type="primary" key="quit-edit" ghost onClick={quitEditMode}>
						<Icon type="rollback" />退出编辑
					</Button>
				),
				(
					<Button type="danger" key="batch-delete" ghost onClick={() => setBatchDeleteModal(true)}>
						<Icon type="delete" />批量删除
					</Button>
				),
				(
					<Button type="primary" key="save" ghost className="green-button">
						<Icon type="save" />保存文本
					</Button>
				)
			];
		}

		// under non-edit mode
		// menu for add drop down
		const addmenu = (
			<Menu>
				<Menu.Item onClick={() => setCharacterModal(true)}>
					<Icon type="user-add" />添加角色
					</Menu.Item>
				<Menu.Item onClick={() => setLocationModal(true)}>
					<Icon type="usergroup-add" />添加势力
					</Menu.Item>
				<Menu.Item onClick={() => setOutlineModal(true)}>
					<Icon type="file-add" />添加大纲
					</Menu.Item>
			</Menu >
		);

		// extra components for non-edit mode
		return [
			(
				<Dropdown key="add" overlay={addmenu} placement="bottomCenter">
					<Button type="primary" key="add-person" ghost>
						<Icon type="folder-add" />添加 ...
						</Button>
				</Dropdown>
			),
			(
				<Button key="edit" type="danger" className="orange-button" ghost onClick={enterEditMode}>
					<Icon type="edit" />编辑模式
					</Button>
			),
			(
				<Button key="delete" type="danger" ghost onClick={() => setDeleteNovelModal(true)}>
					<Icon type="close-circle" />删除小说
					</Button>
			)
		];
	}

	// start batch delete
	async function onBatchDelete() {
		await batchDelete();
		/**
		 * need to reset delete status
		 * otherwise, hooks will not trigger
		 * (because there is no state change)
		 */
		resetBatchDelete();
		setBatchDeleteModal(false);
	}

	return (
		<React.Fragment>
			<PageHeader
				title={''}
				onBack={() => { props.history.goBack(); }}
				extra={extra()}
				className="main-header"
			/>
			<CharacterModal
				showModal={characterVisible}
				closeModal={() => { setCharacterModal(false); cancelCreateCharacter(); }}
				refreshCharacter={refreshCharacter}
				id={id}
			/>
			<OutlineModal
				showModal={outlineVisible}
				closeModal={() => { setOutlineModal(false); cancelCreateOutline(); }}
				refreshOutline={refreshOutline}
				id={id}
			/>
			<LocationModal
				showModal={locationVisible}
				closeModal={() => { setLocationModal(false); cancelCreateLocation(); }}
				refreshLocation={refreshLocation}
				id={id}
			/>
			<NovelModal
				showModal={deleteNovelVisible}
				closeModal={() => setDeleteNovelModal(false)}
				refreshSidebar={refreshSidebar}
				id={id}
			/>
			<Modal
				title="删除小说"
				visible={batchDeleteVisible}
				onOk={onBatchDelete}
				onCancel={() => setBatchDeleteModal(false)}
				footer={[
					<Button
						type="danger"
						key="back"
						onClick={() => setBatchDeleteModal(false)}
						ghost
					>取消
					</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onBatchDelete}
						ghost
					>确认
					</Button>
				]}
			>
				批量删除后，就算点击保存按钮，也会生效！<br />
				并且批量删除后，可以从垃圾箱里进行恢复！<br /><br />
				是否继续？
			</Modal>
		</React.Fragment>
	);
};

export default withRouter(NovelHeader);
