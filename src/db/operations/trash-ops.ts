import Trash from '../models/Trash';
import { deleteFavoriteHelper } from '../operations/fav-ops';
import { deleteOutline, updateDeleted, getOutlinesRange } from '../operations/outline-ops';

// type declaration
import { TrashDataValue } from '../../renderer/components/trash/trashDec';

/**
 * helper functions
 */
// delete outline from trash table
const deleteTrashHelper = (id: string | number): Promise<any> => {
	return Trash
		.destroy({
			where: {
				outline_id: id
			}
		});
};

/**
 * functions to use
 */
// add current outline to trash table
export const addTrash = (id: string | number): Promise<any> => {
	return Trash
		.create({
			outline_id: id
		});
};

// permanent deletion
export const deleteTrash = (id: string | number): Promise<any> => {
	return Promise.all([deleteTrashHelper(id), deleteFavoriteHelper(id), deleteOutline(id)]);
};

// put back outline
export const putbackOutline = (id: string | number): Promise<any> => {
	return Promise.all([deleteTrashHelper(id), updateDeleted(id, 0)]);
};

// get title and description for all trashes
export const getAllTrashesDetail = (): Promise<any> => {
	return Trash.findAll()
		.then((result: any) => {
			// all outlines in trash
			const outlines: number[] = result.map(({ dataValues }: { dataValues: TrashDataValue }) => {
				return dataValues.outline_id;
			});
			// grab title and description for those outlines
			return getOutlinesRange(outlines);
		});
};
