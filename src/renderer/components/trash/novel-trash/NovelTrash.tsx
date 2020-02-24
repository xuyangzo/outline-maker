import * as React from 'react';
import { Col, message as Message, Card, Row, Modal, Button } from 'antd';

// type declaration
import { NovelTrashProps, NovelTrashDataValue } from './novelTrashDec';

// database operations
import { getAllNovelsGivenIdList, deleteNovelPermanently } from '../../../../db/operations/novel-ops';
import { putbackNovel } from '../../../../db/operations/trash-ops';

const NovelTrash = (props: NovelTrashProps) => {
	const { novels, refresh, refreshSidebar, batchDelete } = props;

	// hooks
	const [showBackModal, setBackModal] = React.useState<boolean>(false);
	const [showDeleteModal, setDeleteModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [novelDetails, setNovelDetails] = React.useState<NovelTrashDataValue[]>([]);

	// get novels when props.novels changes & didmount
	React.useEffect(
		() => {
			// if batch delete
			if (batchDelete) {
				Promise
					.all(novels.map((id: number) => deleteNovelPermanently(id)))
					.then(() => {
						Message.success('小说已永久删除！');
						// refresh trash page and sidebar
						refresh();
						refreshSidebar();
					})
					.catch((err: DatabaseError) => {
						Message.error(err.message);
					});

			}
			// otherwise, update novels
			else getNovels();
		},
		[props.novels, props.batchDelete]
	);

	// get novels
	function getNovels() {
		getAllNovelsGivenIdList(novels)
			.then((novels: NovelTrashDataValue[]) => {
				setNovelDetails(novels);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// open back modal
	function onOpenBackModal(e: React.MouseEvent, id: string | number) {
		// prevent bubbling
		e.preventDefault();

		// set selected
		setBackModal(true);
		setSelected(id);
	}

	// close back modal
	function onCloseBackModal() {
		setSelected('');
		setBackModal(false);
	}

	// open delete modal
	function onOpenDeleteModal(e: React.MouseEvent, id: string | number) {
		// prevent bubbling
		e.preventDefault();

		// set selected
		setDeleteModal(true);
		setSelected(id);
	}

	// close delete modal
	function onCloseDeleteModal() {
		setSelected('');
		setDeleteModal(false);
	}

	// delete novel
	function onDeleteNovel() {
		// delete novel permanently from db
		deleteNovelPermanently(selected)
			.then(() => {
				// alert success
				Message.success('永久删除小说成功！');
				// close modal
				onCloseDeleteModal();
				// refresh novels
				refresh();
			})
			.catch((err: DatabaseError) => {
				// close modal
				onCloseDeleteModal();
				// alert error
				Message.error(err.message);
			});
	}

	// put back novel
	function onPutBackNovel() {
		// put back novel from db
		putbackNovel(selected)
			.then(() => {
				// alert success
				Message.success('小说已经放回原处！');
				// close modal
				onCloseBackModal();
				// refresh novels
				refresh();
				// refresh sidebar
				refreshSidebar();
			})
			.catch((err: DatabaseError) => {
				// close modal
				onCloseDeleteModal();
				// alert error
				Message.error(err.message);
			});
	}

	return (
		<Row>
			{
				novelDetails.map((novel: NovelTrashDataValue) => (
					<Col span={8} key={novel.id}>
						<Card
							title={novel.name}
							bordered={false}
							hoverable
							className="custom-card"
						>
							<Button
								type="danger"
								ghost
								block
								className="green-button put-back-button"
								onClick={(e: React.MouseEvent) => onOpenBackModal(e, novel.id)}
							>
								放回原处
							</Button>
							<Button
								type="danger"
								ghost
								block
								onClick={(e: React.MouseEvent) => onOpenDeleteModal(e, novel.id)}
							>
								永久删除
							</Button>
						</Card>
					</Col>
				))
			}
			<Modal
				title="永久删除小说"
				visible={showDeleteModal}
				onOk={onDeleteNovel}
				onCancel={onCloseDeleteModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseDeleteModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteNovel}
						ghost
					>确认
					</Button>
				]}
			>
				小说永久删除后无法恢复！！！<br />
				并且删除小说会删除以下内容：<br /><br />
				<ol>
					<li>该小说所包含的所有背景、人物、势力、大纲、道具</li>
					<li>已经位于回收站中的，该小说所包含的所有人物、势力、大纲、道具</li>
				</ol>
			</Modal>
			<Modal
				title="放回小说"
				visible={showBackModal}
				onOk={onPutBackNovel}
				onCancel={onCloseBackModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseBackModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onPutBackNovel}
						ghost
					>确认
					</Button>
				]}
			>
				是否将小说放回原处？
			</Modal>
		</Row>
	);
};

export default NovelTrash;
