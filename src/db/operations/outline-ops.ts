import Outlines from '../models/Outlines';
import { addTrash } from '../operations/trash-ops';
const Op = require('sequelize').Op;

// type declaration
import { OutlineModalTemplate } from '../../renderer/components/novel-header/outline-modal/outlineModalDec';

interface OutlineTemplate {
	title?: string;
	description?: string;
	novel_id?: string | number;
	scaling?: string;
	fav?: number;
	deleted?: number;
}

// get outline given id
export const getOutline = (id: string | number): Promise<any> => {
	return Outlines
		.findOne({
			where: { id }
		});
};

// get outline's id, title and description
export const getOutlineShort = (id: string | number): Promise<any> => {
	return Outlines
		.findOne({
			attributes: ['id', 'title', 'description'],
			where: { id }
		});
};

// get all outlines
export const getAllOutlines = (): Promise<any> => {
	return Outlines
		.findAll({
			order: [['id', 'DESC']]
		});
};

// get all outlines given novel
export const getAllOutlinesGivenNovel = (id: string | number): Promise<any> => {
	return Outlines
		.findAll({
			where: {
				novel_id: id,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['id', 'ASC']]
		});
};

// get all non-deleted outlines
export const getAllNonDeletedOutlinesRange = (outlines: string[] | number[]): Promise<any> => {
	return Outlines.
		findAll({
			where: {
				id: outlines,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['updatedAt', 'DESC']]
		});
};

// get outlines given array
export const getOutlinesRange = (outlines: number[]): Promise<any> => {
	return Outlines.
		findAll({
			where: { id: outlines },
			order: [['updatedAt', 'DESC']]
		});
};

// create new outline
export const createOutline = (props: OutlineModalTemplate) => {
	return Outlines
		.create(props);
};

// update outline scaling
export const updateScaling = (id: string | number, scaling: string): Promise<any> => {
	return Outlines
		.update(
			{ scaling },
			{ where: { id } }
		);
};

// update outline
export const updateOutline = (id: string | number, props: OutlineTemplate): Promise<any> => {
	return Outlines
		.update(
			props,
			{ where: { id } }
		);
};

// update outline's fav property
export const updateOutlineFav = (id: string | number, fav: number): Promise<any> => {
	return Outlines
		.update(
			{ fav },
			{ where: { id } }
		);
};

// update outline's deleted property
export const updateDeleted = (id: string | number, deleted: number): Promise<any> => {
	return Outlines
		.update(
			{ deleted },
			{ where: { id } }
		);
};

// permanent deletion
export const deleteOutlinePermanently = (id: string | number): Promise<any> => {
	return Outlines
		.destroy({
			where: { id }
		});
};

/**
 * delete outline temporarily
 * 1) update outline's deleted property to be 1
 * 2) add deleted outline to trash
 */
export const deleteOutlineTemp = (id: string | number): Promise<any> => {
	return Promise.all([
		updateOutline(id, { deleted: 1 }),
		addTrash({ outline_id: id })
	]);
};
