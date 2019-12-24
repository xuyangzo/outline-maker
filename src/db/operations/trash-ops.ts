import Trash from '../models/Trash';
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

// delete location from trash table
const deleteLocationHelper = (loc_id: string | number): Promise<any> => {
	return Trash
		.destroy({
			where: {
				loc_id
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
 * put back character
 * 1) update character's deleted field to be 0
 * 2) delete character from trash
 */
export const putbackCharacter = (id: string | number): Promise<any> => {
	return Promise.all([
		deleteCharacterHelper(id),
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
		deleteLocationHelper(id),
		updateLocation(id, { deleted: 0 })
	]);
};
