import Trash from '../models/Trash';
import { updateNovel } from './novel-ops';
import { updateOutline } from './outline-ops';
import { updateCharacter } from './character-ops';
import { updateLocation } from './location-ops';

// type declaration
interface TrashTemplate {
	novel_id?: string | number;
	outline_id?: string | number;
	character_id?: string | number;
	loc_id?: string | number;
}

/**
 * helper functions
 */
// delete novel from trash table
const deleteTrashHelper = (id: string | number, type: string): Promise<any> => {
	return Trash
		.destroy({
			where: {
				[type]: id
			}
		});
};

/**
 * functions to use
 */
// get all trashes
export const getAllTrashes = (): Promise<any> => {
	return Trash.findAll();
};

// add current novel/outline/character/location to trash table
export const addTrash = (props: TrashTemplate): Promise<any> => {
	return Trash
		.create(props);
};

/**
 * put back novel
 * 1) update novel's deleted field to be 0
 * 2) delete novel from trash
 */
export const putbackNovel = (id: string | number): Promise<any> => {
	return Promise.all([
		deleteTrashHelper(id, 'novel_id'),
		updateNovel(id, { deleted: 0 })
	]);
};

/**
 * put back outline
 * 1) update outline's deleted field to be 0
 * 2) delete outline from trash
 */
export const putbackOutline = (id: string | number): Promise<any> => {
	return Promise.all([
		deleteTrashHelper(id, 'outline_id'),
		updateOutline(id, { deleted: 0 })
	]);
};

/**
 * put back character
 * 1) update character's deleted field to be 0
 * 2) delete character from trash
 */
export const putbackCharacter = (id: string | number): Promise<any> => {
	return Promise.all([
		deleteTrashHelper(id, 'character_id'),
		updateCharacter(id, { deleted: 0 })
	]);
};

/**
 * put back location
 * 1) update location's deleted field to be 0
 * 2) delete location from trash
 */
export const putbackLocation = (id: string | number): Promise<any> => {
	return Promise.all([
		deleteTrashHelper(id, 'loc_id'),
		updateLocation(id, { deleted: 0 })
	]);
};
