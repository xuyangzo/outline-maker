import * as React from 'react';
import { Col, message as Message, Card, Row, Icon, Modal, Button } from 'antd';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { OutlineSectionProps } from './outlineSectionDec';
import { Outline } from '../../sidebar/sidebarDec';
import { DatabaseError } from 'sequelize';

// database operations
import { deleteOutlineTemp } from '../../../../db/operations/outline-ops';

const OutlineSection = (props: OutlineSectionProps) => {
	const { outlines, novel_id, onCreateOutline, refreshOutline } = props;

	// hooks
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');

	// open modal
	function onOpenModal(e: React.MouseEvent, id: string | number) {
		// prevent bubbling
		e.preventDefault();

		// set selected
		setShowModal(true);
		setSelected(id);
	}

	// close modal
	function onCloseModal() {
		setSelected('');
		setShowModal(false);
	}

	// delete outline
	function onDeleteOutline() {
		// delete outline temporarily (can be recovered from trash)
		deleteOutlineTemp(selected)
			.then(() => {
				// alert success
				Message.success('删除大纲成功！');
				// close modal
				onCloseModal();
				// refresh locations
				refreshOutline(novel_id);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Row>
			{
				outlines.map((outline: Outline) => (
					<Col span={6} key={outline.id} className="card-container">
						<div
							className="delete-icon"
							onClick={(e: React.MouseEvent) => onOpenModal(e, outline.id)}
						>
							<Icon type="close" />
						</div>
						<Card
							title={outline.title}
							bordered={false}
							hoverable
							className="custom-card outline-card"
							onClick={() => {
								props.history.push(`/outline/${novel_id}/${outline.id}`);
							}}
						>
							<p>{outline.description}</p>
						</Card>
					</Col>
				))
			}
			{
				!outlines.length && (
					<Col span={6}>
						<Card
							title="还没有大纲哦..."
							bordered={false}
							hoverable
							className="custom-card add-character-card"
							onClick={onCreateOutline}
						>
							<Icon type="file-add" /> 新建大纲
						</Card>
					</Col>
				)
			}
			<Modal
				title="删除大纲"
				visible={showModal}
				onOk={onDeleteOutline}
				onCancel={onCloseModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteOutline}
						ghost
					>确认
					</Button>
				]}
			>
				大纲删除后可以去垃圾箱恢复！是否继续？
			</Modal>
		</Row>
	);
};

export default withRouter(OutlineSection);
