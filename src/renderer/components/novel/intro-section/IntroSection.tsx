import * as React from 'react';
import { message as Message, Input } from 'antd';
const { TextArea } = Input;

// type declaration
import { IntroSectionProps } from './introSectionDec';
import { NovelDataValue } from '../novelDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getNovel } from '../../../../db/operations/novel-ops';

// utils
import { tagColors } from '../../../utils/constants';

const IntroSection = (props: IntroSectionProps) => {
	const { novel_id, isEdit } = props;

	// hooks
	const [name, setName] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');
	const [categories, setCategories] = React.useState<string[]>([]);
	React.useEffect(
		() => {
			getNovelContent();
		},
		[props.novel_id]
	);

	// on input change
	function onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
		const name = event.target.value;
		setName(name);
	}

	// the event of textarea change is different, so use a separate method
	function onDescriptionChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		const description = event.target.value;
		setDescription(description);
	}

	// get novel content
	function getNovelContent() {
		getNovel(novel_id)
			.then(({ dataValues }: { dataValues: NovelDataValue }) => {
				setName(dataValues.name);
				setDescription(dataValues.description);
				setCategories(dataValues.categories ? dataValues.categories.split(',') : []);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<div style={{ position: 'relative' }}>
			{
				isEdit ?
					(
						<input
							type="text"
							value={name}
							className="novel-title-input"
							onChange={onNameChange}
							placeholder="小说名字应该在 12 个字以内！"
						/>
					) :
					(
						<h2 style={{ display: 'inline-block', marginRight: '10px' }}>{name}</h2>
					)
			}
			{
				categories.map((category: string, index: number) => (
					<div
						className="novel-tag"
						key={category}
						style={{
							color: tagColors[index],
							borderColor: tagColors[index]
						}}
					>{category}
					</div>
				))
			}
			{
				!categories.length && (
					<div className="novel-tag">暂无标签</div>
				)
			}
			{
				isEdit ? (
					<TextArea
						value={description}
						onChange={onDescriptionChange}
						autoSize={
							{ minRows: 10, maxRows: 10 }
						}
						placeholder="简介应该在 300 个字之内"
						style={{ width: '60%', display: 'block' }}
					/>
				) :
					(
						<p className="novel-description">{description}</p>
					)
			}
			<br />
		</div>
	);
};

export default IntroSection;
