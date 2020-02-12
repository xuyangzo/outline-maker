import Novel from '../models/Novels';
import { addTrash } from './trash-ops';
const Op = require('sequelize').Op;

// type declaration
import { CreateNovelModalTemplate } from '../../renderer/components/sidebar/sidebarDec';
import { Descriptions } from 'antd';

interface NovelTemplate {
	name?: string;
	description?: string;
	categories?: string;
	deleted?: number;
}

// get all novels
export const getAllNovels = (): Promise<any> => {
	return Novel.findAll({
		where: {
			deleted: {
				[Op.ne]: 1
			}
		},
		order: [['id', 'DESC']]
	});
};

// get novel given id
export const getNovel = async (id: number | string): Promise<any> => {
	const dataModel: DataResult = await Novel
		.findOne({
			attributes: ['name', 'description', 'categories'],
			where: {
				id,
				deleted: {
					[Op.ne]: 1
				}
			}
		});

	if (dataModel) {
		const { name, description, categories } = dataModel.dataValues;
		return { name, description, categories };
	}

	return {
		name: '未知',
		description: '未知',
		categories: ''
	};
};

// get novel id and name
export const getNovelShort = (id: number | string): Promise<any> => {
	return Novel
		.findOne({
			attributes: ['id', 'name'],
			where: { id }
		});
};

// create new novel
export const createNovel = (props: CreateNovelModalTemplate): Promise<any> => {
	return Novel.create(props);
};

// update novel
export const updateNovel = (id: string | number, props: NovelTemplate): Promise<any> => {
	return Novel
		.update(
			props,
			{ where: { id } }
		);
};

/**
 * delete novel temporarily
 * 1) update novel's deleted field to be 1
 * 2) add novel to trash
 */
export const deleteNovelTemp = (id: number | string): Promise<any> => {
	return Promise.all([
		addTrash({ novel_id: id }),
		updateNovel(id, { deleted: 1 })
	]);
};

// delete novel permanently
export const deleteNovelPermanently = (id: number | string): Promise<any> => {
	return Novel
		.destroy({
			where: { id }
		});
};
