import Trash from '../models/Trash';
import { updateNovel } from './novel-ops';
import { updateOutline } from './outline-ops';
import { updateCharacter } from './character-ops';
import { updateLocation } from './location-ops';

// type declaration
import { TrashDataValue } from '../../renderer/components/trash/trashDec';

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
const deleteTrashHelper = (id: string | number, type: string): Promise<DataUpdateResult> => {
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
export const getAllTrashes = async (): Promise<TrashDataValue> => {
	const dataResults: DataResults = await Trash.findAll();

	const novels: number[] = [];
	const outlines: number[] = [];
	const characters: number[] = [];
	const locations: number[] = [];

	if (dataResults && dataResults.length) {
		// filter novels, outlines, characters, locations
		dataResults.forEach((result: DataModel) => {
			const { novel_id, outline_id, character_id, loc_id } = result.dataValues;
			/**
			 * each array does not conflict with each other
			 * which is based on the database structure
			 */
			if (novel_id) novels.push(novel_id);
			if (outline_id) outlines.push(outline_id);
			if (character_id) characters.push(character_id);
			if (loc_id) locations.push(loc_id);
		});
	}

	return { novels, outlines, characters, locations };
};

// add current novel/outline/character/location to trash table
export const addTrash = (props: TrashTemplate): Promise<DataUpdateResult> => {
	return Trash.create(props);
};

/**
 * put back novel
 * 1) update novel's deleted field to be 0
 * 2) delete novel from trash
 */
export const putbackNovel = (id: string | number): Promise<DataUpdateResults> => {
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
export const putbackOutline = (id: string | number): Promise<DataUpdateResults> => {
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
export const putbackCharacter = (id: string | number): Promise<DataUpdateResults> => {
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
export const putbackLocation = (id: string | number): Promise<DataUpdateResults> => {
	return Promise.all([
		deleteTrashHelper(id, 'loc_id'),
		updateLocation(id, { deleted: 0 })
	]);
};
