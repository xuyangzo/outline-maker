import * as React from 'react';
import { Col, message as Message, Card, Row, Modal, Button } from 'antd';

// type declaration
import { OutlineTrashProps, OutlineTrashDataValue } from './outlineTrashDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getAllOutlinesGivenIdList, deleteOutlinePermanently } from '../../../../db/operations/outline-ops';
import { putbackOutline } from '../../../../db/operations/trash-ops';

const OutlineTrash = (props: OutlineTrashProps) => {
	const { outlines, refresh, batchDelete } = props;

	// hooks
	const [showBackModal, setBackModal] = React.useState<boolean>(false);
	const [showDeleteModal, setDeleteModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [outlineDetails, setOutlineDetails] = React.useState<OutlineTrashDataValue[]>([]);

	// get outlines when props.outlines changes & didmount
	React.useEffect(
		() => {
			// if batch delete
			if (batchDelete) {
				Promise
					.all(outlines.map((id: number) => deleteOutlinePermanently(id)))
					.then(() => {
						Message.success('势力已永久删除！');
						// refresh
						refresh();
					})
					.catch((err: DatabaseError) => {
						Message.error(err.message);
					});

			}
			// otherwise, update outlines
			else getOutlines();
		},
		[props.outlines, props.batchDelete]
	);

	// get outlines
	function getOutlines() {
		getAllOutlinesGivenIdList(outlines)
			.then((outlines: OutlineTrashDataValue[]) => {
				setOutlineDetails(outlines);
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

	// delete outline
	function onDeleteOutline() {
		// delete outline permanently from db
		deleteOutlinePermanently(selected)
			.then(() => {
				// alert success
				Message.success('永久删除大纲成功！');
				// close modal
				onCloseDeleteModal();
				// refresh outlines
				refresh();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// put back outline
	function onPutBackOutline() {
		// put back outline from db
		putbackOutline(selected)
			.then(() => {
				// alert success
				Message.success('大纲已经放回原处！');
				// close modal
				onCloseBackModal();
				// refresh outlines
				refresh();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Row>
			{
				outlineDetails.map((outline: OutlineTrashDataValue) => (
					<Col span={8} key={outline.id}>
						<Card
							title={outline.title}
							bordered={false}
							hoverable
							className="custom-card"
						>
							<p className="description">{outline.description}</p>
							<br /><br />
							<Button
								type="danger"
								ghost
								block
								className="green-button put-back-button"
								onClick={(e: React.MouseEvent) => onOpenBackModal(e, outline.id)}
							>
								放回原处
							</Button>
							<Button
								type="danger"
								ghost
								block
								onClick={(e: React.MouseEvent) => onOpenDeleteModal(e, outline.id)}
							>
								永久删除
							</Button>
						</Card>
					</Col>
				))
			}
			<Modal
				title="永久删除大纲"
				visible={showDeleteModal}
				onOk={onDeleteOutline}
				onCancel={onCloseDeleteModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseDeleteModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteOutline}
						ghost
					>确认
					</Button>
				]}
			>
				大纲永久删除后无法恢复！！！
			</Modal>
			<Modal
				title="放回大纲"
				visible={showBackModal}
				onOk={onPutBackOutline}
				onCancel={onCloseBackModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseBackModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onPutBackOutline}
						ghost
					>确认
					</Button>
				]}
			>
				是否将大纲放回原处？
			</Modal>
		</Row>
	);
};

export default OutlineTrash;
