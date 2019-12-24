import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message as Message } from 'antd';

// enable history
import { withRouter } from 'react-router-dom';

// database operations
import { deleteNovelTemp } from '../../../../db/operations/novel-ops';

// type declaration
import { NovelModalProps } from './novelModalDec';
import { DatabaseError } from 'sequelize';

const NovelModal = (props: NovelModalProps) => {
	const { showModal, id, closeModal, refreshSidebar } = props;

	// delete novel temporarily
	function onDeleteNovel() {
		deleteNovelTemp(id)
			.then(() => {
				// alert success
				Message.success('小说删除成功！');
				// close modal
				closeModal();
				// refresh sidebar
				refreshSidebar();
				// redirect to trash page
				props.history.push('/trash');
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Modal
			title="删除小说"
			visible={showModal}
			onOk={onDeleteNovel}
			onCancel={closeModal}
			footer={[
				<Button type="danger" key="back" onClick={closeModal} ghost>取消</Button>,
				<Button
					type="primary"
					key="submit"
					onClick={onDeleteNovel}
					ghost
				>确认
				</Button>
			]}
		>
			小说删除后可以在垃圾箱里恢复！是否删除？
		</Modal>
	);
};

export default withRouter(NovelModal);
