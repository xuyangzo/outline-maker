import Trash from '../models/Trash';
import { deleteFavoriteHelper } from './fav-ops';
import { updateCharacterGivenOutline } from './character-ops';
import { deleteTimelineGivenOutline } from './timeline-ops';
import { deleteOutlineDetailGivenOutline } from './detail-ops';
import { deleteOutline, getOutlinesRange, updateOutline } from './outline-ops';

// type declaration
import { TrashDataValue } from '../../renderer/components/trash/trashDec';

/**
 * helper functions
 */
// delete outline from trash table
const deleteOutlineHelper = (id: string | number): Promise<any> => {
	return Trash
		.destroy({
			where: {
				outline_id: id
			}
		});
};

interface TrashTemplate {
	novel_id?: string | number;
	outline_id?: string | number;
	character_id?: string | number;
	loc_id?: string | number;
}

/**
 * functions to use
 */
// add current novel/outline/character/location to trash table
export const addTrash = (props: TrashTemplate): Promise<any> => {
	return Trash
		.create(props);
};

/**
 * permanent deletion
 * 1) delete outline from trash table with this outline_id
 * 2) delete favorites from favorite table with this outline_id
 * 3) delete outline_detail from outline_detail table with this outline_id
 * 4) update characters from character table with outline_id to be null
 * 5) then, delete timelines from timeline table with this outline_id
 * 6) then, delete outline from outline table
 */
export const deleteOutlinePermanently = async (id: string | number): Promise<any> => {
	await Promise.all([
		deleteOutlineHelper(id),
		deleteFavoriteHelper(id),
		deleteOutlineDetailGivenOutline(id),
		updateCharacterGivenOutline(id, { outline_id: 0 })
	]);
	await deleteTimelineGivenOutline(id);
	return deleteOutline(id);
};

/**
 * put back outline
 * 1) update outline's deleted field to be 0
 * 2) delete outline from trash
 */
export const putbackOutline = (id: string | number): Promise<any> => {
	return Promise.all([
		deleteOutlineHelper(id),
		updateOutline(id, { deleted: 0 })
	]);
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
