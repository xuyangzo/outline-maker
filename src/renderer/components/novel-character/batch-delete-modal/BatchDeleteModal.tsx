import * as React from 'react';
import { Button, Modal, message as Message } from 'antd';

// database operations
import { deleteCharacterTemp } from '../../../../db/operations/character-ops';

// type declaration
import { BatchDeleteModalProps } from './batchDeleteModalDec';

const BatchDeleteModal = (props: BatchDeleteModalProps) => {
	const { showModel, checkedList, closeModel, refreshCharacter, clearCheckedList } = props;

	// batch delete characters
	function handleSubmit() {
		if (checkedList.length) {
			Promise
				.all(checkedList.map((id: string) => deleteCharacterTemp(id)))
				.then(() => {
					Message.success('选中的角色已经被删除！');
					// refresh characters
					refreshCharacter();
					// close model
					closeModel();
					// clear checked list
					clearCheckedList();
				})
				.catch((err: DatabaseError) => {
					Message.error(err.message);
				});
		}
	}

	return (
		<Modal
			title="批量删除角色"
			visible={showModel}
			onOk={handleSubmit}
			onCancel={closeModel}
			footer={[
				<Button type="danger" key="back" onClick={closeModel} ghost>取消</Button>,
				<Button
					type="primary"
					key="submit"
					onClick={handleSubmit}
					ghost
				>确认
				</Button>
			]}
		>
			批量删除角色后，不需要保存！<br />
			被删除的角色会直接进入回收站！<br /><br />
			是否继续？
		</Modal>
	);
};

export default BatchDeleteModal;
