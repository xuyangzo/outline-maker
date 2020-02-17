import OutlineModel from '../models/Outlines';
import CharacterOutlineModel from '../models/CharacterOutlines';
import { addTrash } from '../operations/trash-ops';
const Op = require('sequelize').Op;

// type declaration
import { OutlineModalTemplate } from '../../renderer/components/novel-outline/outline-modal/outlineModalDec';
import { FavoriteDataValue } from '../../renderer/components/favorite/favoriteDec';
import { OutlineDataValue } from '../../renderer/components/main/mainDec';
import { OutlineTrashDataValue } from '../../renderer/components/trash/outline-trash/outlineTrashDec';
import { NovelOutlineDataValue } from '../../renderer/components/novel-outline/novelOutlineDec';
import { OutlineCharacterDataValue } from '../../renderer/components/character/characterDec';

interface OutlineTemplate {
	title?: string;
	description?: string;
	novel_id?: string | number;
	scaling?: string;
	fav?: number;
	deleted?: number;
	novelPageOrder?: number;
}

// get outline given id
export const getOutline = async (id: string | number): Promise<OutlineDataValue> => {
	const dataResult: DataResult = await OutlineModel
		.findOne({
			attibutes: ['id', 'title', 'description', 'scaling'],
			where: { id }
		});

	const data: OutlineDataValue = {
		id: -1,
		title: '找不到该大纲！',
		description: '',
		scaling: '1'
	};
	if (dataResult) {
		const { id, title, description, scaling } = dataResult.dataValues;
		if (id) data.id = id;
		if (title) data.title = title;
		if (description) data.description = description;
		if (scaling) data.scaling = scaling;
	}

	return data;
};

/**
 * helper function
 * get outline's id, title and description
 */
const getOutlineHelper = (id: string | number): Promise<DataModel> => {
	return OutlineModel
		.findOne({
			attributes: ['id', 'title', 'description'],
			where: { id }
		});
};

// get all outlines given id list
export const getAllOutlinesGivenIdList = async (idList: (string | number)[]): Promise<OutlineTrashDataValue[]> => {
	const promises: Promise<any>[] = idList.map((outlineId: string | number) => {
		return getOutlineHelper(outlineId);
	});

	const dataResults: DataResults = await Promise.all(promises);

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// get all outlines given novel
export const getAllOutlinesGivenNovel = async (id: string | number): Promise<NovelOutlineDataValue[]> => {
	const dataResults: DataResults = await OutlineModel
		.findAll({
			attributes: ['id', 'title', 'description'],
			where: {
				novel_id: id,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// get all outlines given id range
export const getOutlinesGivenIdRange = async (outlines: string[] | number[]): Promise<FavoriteDataValue[]> => {
	const dataResults: DataResults = await OutlineModel
		.findAll({
			attributes: ['id', 'novel_id', 'title', 'description'],
			where: {
				id: outlines,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['updatedAt', 'DESC']]
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => {
			const { id, novel_id, title, description } = result.dataValues;
			return { id, novel_id, title, description };
		});
	}

	return [];
};

// create new outline
export const createOutline = async (props: OutlineModalTemplate): Promise<WriteDataModel> => {
	const maxOrder: number | null = await OutlineModel.max('novelPageOrder', { where: { novel_id: props.novel_id } });
	const outline: DataModel = await OutlineModel
		.create({
			...props,
			novelPageOrder: (maxOrder || 0) + 1
		});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['outline'],
		success: false
	};
	if (outline) {
		result.id = outline.dataValues.id;
		result.success = true;
	}

	return result;
};

// update outline
export const updateOutline = async (id: string | number, props: OutlineTemplate): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await OutlineModel
		.update(
			props,
			{ where: { id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['outline'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};

// permanent deletion
export const deleteOutlinePermanently = async (id: string | number): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await OutlineModel
		.destroy({
			where: { id }
		});

	return {
		type: 'deleteP',
		tables: ['outline'],
		success: dataResult === 1
	};
};

/**
 * delete outline temporarily
 * 1) update outline's deleted property to be 1
 * 2) add deleted outline to trash
 */
export const deleteOutlineTemp = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		updateOutline(id, { deleted: 1 }),
		addTrash({ outline_id: id })
	]);

	return {
		type: 'deleteT',
		tables: ['outline', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

// search outlines
export const searchOutline = async (novel_id: string | number, key: string): Promise<NovelOutlineDataValue[]> => {
	if (key === '') return getAllOutlinesGivenNovel(novel_id);

	const dataResults: DataResults = await OutlineModel
		.findAll({
			attributes: ['id', 'title', 'description'],
			where: {
				novel_id,
				[Op.or]: [
					{
						title: {
							[Op.like]: '%'.concat(key).concat('%')
						}
					},
					{
						description: {
							[Op.like]: '%'.concat(key).concat('%')
						}
					}
				],
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// get all outlines that target character belongs to
export const getAllOutlinesGivenCharacter = async (
	character_id: string | number
): Promise<OutlineCharacterDataValue[]> => {
	const dataResults: DataResults = await OutlineModel
		.findAll({
			attributes: ['id', 'title'],
			include: [{
				model: CharacterOutlineModel,
				where: { character_id },
				required: true,
			}]
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};
