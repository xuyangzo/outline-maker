import * as React from 'react';
import { Button, Modal, message as Message } from 'antd';

// database operations
import { deleteLocationTemp } from '../../../../db/operations/location-ops';

// type declaration
import { BatchDeleteModalProps } from './batchDeleteModalDec';
import { DatabaseError } from 'sequelize';

const BatchDeleteModal = (props: BatchDeleteModalProps) => {
	const { showModel, checkedList, closeModel, refreshLocation, clearCheckedList } = props;

	// batch delete locations
	function handleSubmit() {
		if (checkedList.length) {
			Promise
				.all(checkedList.map((id: string) => deleteLocationTemp(id)))
				.then(() => {
					Message.success('选中的势力已经被删除！');
					// refresh characters
					refreshLocation();
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
			title="批量删除势力"
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
			批量删除势力后，不需要保存！<br />
			被删除的势力会直接进入回收站！<br /><br />
			是否继续？
		</Modal>
	);
};

export default BatchDeleteModal;
