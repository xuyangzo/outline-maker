import Trash from '../models/Trash';
import { deleteFavoriteHelper } from './fav-ops';
import { updateCharacterGivenOutline, deleteCharacter, updateCharacter } from './character-ops';
import { deleteTimelineGivenOutline } from './timeline-ops';
import { deleteOutlineDetailsGivenOutline, deleteOutlineDetailsGivenChar } from './detail-ops';
import { deleteOutline, updateOutline } from './outline-ops';

/**
 * helper functions
 */
// delete outline from trash table
const deleteOutlineHelper = (outline_id: string | number): Promise<any> => {
	return Trash
		.destroy({
			where: {
				outline_id
			}
		});
};

// delete character from trash table
const deleteCharacterHelper = (character_id: string | number): Promise<any> => {
	return Trash
		.destroy({
			where: {
				character_id
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
		deleteOutlineDetailsGivenOutline(id),
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

/**
 * delete character permanently
 * 1) delete outline_details from outline_details table given this character_id
 * 2) delete character from trash table\
 * 3) then, delete character
 */
export const deleteCharacterPermanently = async (id: string | number): Promise<any> => {
	await Promise.all([
		deleteOutlineDetailsGivenChar(id),
		deleteCharacterHelper(id)
	]);
	return deleteCharacter(id);
};

/**
 * put back character
 */
export const putbackCharacter = (id: string | number): Promise<any> => {
	return Promise.all([
		deleteCharacterHelper(id),
		updateCharacter(id, { deleted: 0 })
	]);
};

// get title and description for all trashes
export const getAllTrashes = (): Promise<any> => {
	return Trash.findAll();
};
