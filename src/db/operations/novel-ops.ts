import NovelModel from '../models/Novels';
import { addTrash } from './trash-ops';
const Op = require('sequelize').Op;

// type declaration
import { NovelDataValue } from '../../renderer/components/novel/novelDec';
import { CreateNovelModalTemplate, NovelSidebarDataValue } from '../../renderer/components/sidebar/sidebarDec';
import { NovelTrashDataValue } from '../../renderer/components/trash/novel-trash/novelTrashDec';

interface NovelTemplate {
	name?: string;
	description?: string;
	categories?: string;
	deleted?: number;
}

// get all novels
export const getAllNovels = async (): Promise<NovelSidebarDataValue[]> => {
	const dataResults: DataResults = await NovelModel
		.findAll({
			attributes: ['id', 'name'],
			where: {
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['id', 'DESC']]
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// get novel given id
export const getNovel = async (id: number | string): Promise<NovelDataValue> => {
	const dataModel: DataResult = await NovelModel
		.findOne({
			attributes: ['name', 'description', 'categories'],
			where: {
				id,
				deleted: {
					[Op.ne]: 1
				}
			}
		});

	const data: NovelDataValue = {
		name: '未知',
		description: '未知',
		categories: ''
	};
	if (dataModel) {
		const { name, description, categories } = dataModel.dataValues;
		if (name) data.name = name;
		if (description) data.description = description;
		if (categories) data.categories = categories;
	}

	return data;
};

/**
 * helper function
 * get novel id and name
 */
const getNovelHelper = (id: number | string): Promise<DataModel> => {
	return NovelModel
		.findOne({
			attributes: ['id', 'name'],
			where: { id }
		});
};

// get all novels by id list
export const getAllNovelsGivenIdList = async (idList: (number | string)[]): Promise<NovelTrashDataValue[]> => {
	const promises: Promise<DataModel>[] = idList.map((novelId: number | string) => {
		return getNovelHelper(novelId);
	});

	const dataResults: DataResults = await Promise.all(promises);
	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// create new novel
export const createNovel = async (props: CreateNovelModalTemplate): Promise<WriteDataModel> => {
	const novel: DataModel = await NovelModel.create(props);

	const result: WriteDataModel = {
		type: 'create',
		tables: ['novel'],
		success: false
	};
	if (novel) {
		result.id = novel.dataValues.id;
		result.success = true;
	}

	return result;
};

// update novel
export const updateNovel = async (id: string | number, props: NovelTemplate): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await NovelModel
		.update(
			props,
			{ where: { id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['novel'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};

/**
 * delete novel temporarily
 * 1) update novel's deleted field to be 1
 * 2) add novel to trash
 */
export const deleteNovelTemp = async (id: number | string): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		addTrash({ novel_id: id }),
		updateNovel(id, { deleted: 1 })
	]);

	return {
		type: 'deleteT',
		tables: ['novel', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

// delete novel permanently
export const deleteNovelPermanently = async (id: number | string): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await NovelModel
		.destroy({
			where: { id }
		});

	return {
		type: 'deleteP',
		tables: ['novel'],
		success: dataResult === 1
	};
};
