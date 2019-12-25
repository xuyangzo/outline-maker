import * as React from 'react';
import { message as Message, Input, Icon } from 'antd';
const { TextArea } = Input;

// type declaration
import { IntroSectionProps } from './introSectionDec';
import { NovelDataValue } from '../novelDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getNovel, updateNovel } from '../../../../db/operations/novel-ops';

// utils
import { tagColors, tags } from '../../../utils/constants';

const IntroSection = (props: IntroSectionProps) => {
	const { novel_id, isEdit, shouldSave } = props;

	// hooks
	const [name, setName] = React.useState<string>('');
	const [description, setDescription] = React.useState<string>('');
	const [categories, setCategories] = React.useState<string[]>([]);
	React.useEffect(
		() => {
			// save
			if (shouldSave) onSave();
			// refresh content
			else getNovelContent();
		},
		[props.novel_id, props.shouldSave]
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

	// add new tag
	function onAddTag(tag: string) {
		if (categories.length === 4) {
			Message.error('最多只能选择四个标签！');
			return;
		}

		setCategories(categories.concat(tag));
	}

	// delete new tag
	function onDeleteTag(tag: string) {
		setCategories(categories.filter((currTag: string) => currTag !== tag));
	}

	// on save
	function onSave() {
		updateNovel(novel_id, { name, description, categories: categories.join(',') })
			.then(() => {
				Message.success('保存成功！');
				// refresh content
				getNovelContent();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
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

	// categories elements under normal mode
	function categoriesNonEditJSX(): React.ReactElement<{}> {
		return (
			<div className="tag-container">
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
			</div>
		);
	}

	// categories elements under edit mode
	function categoriesEditJSX(): React.ReactElement {
		return (
			<div className="tag-container tag-container-edit">
				<div className="tag-container-header tag-container-header-edit">
					{
						categories.map((category: string, index: number) => (
							<div
								className="novel-tag"
								key={category}
								style={{
									color: tagColors[index],
									borderColor: tagColors[index]
								}}
							>
								{category}&nbsp;&nbsp;
								<Icon
									type="close"
									style={{ color: tagColors[index], cursor: 'pointer' }}
									onClick={() => onDeleteTag(category)}
								/>
							</div>
						))
					}
				</div>
				<div className="tag-container-content">
					{
						tags.map((tag: string) => (
							<div
								className="novel-tag novel-tag-edit"
								key={tag}
								onClick={() => onAddTag(tag)}
							>
								{tag}
							</div>
						))
					}
				</div>
			</div>
		);
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
			{isEdit ? categoriesEditJSX() : categoriesNonEditJSX()}
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
