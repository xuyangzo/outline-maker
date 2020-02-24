import Trash from '../models/Trash';
import { updateNovel } from './novel-ops';
import { updateOutline } from './outline-ops';
import { updateCharacter } from './character-ops';
import { updateLocation } from './location-ops';
import { updateInventory } from './inventory-ops';

// type declaration
import { TrashDataValue } from '../../renderer/components/trash/trashDec';

// type declaration
interface TrashTemplate {
	novel_id?: string | number;
	outline_id?: string | number;
	character_id?: string | number;
	loc_id?: string | number;
	inventory_id?: string | number;
}

/**
 * helper functions
 */
// delete novel from trash table
const deleteTrashHelper = async (id: string | number, type: string): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await Trash
		.destroy({
			where: {
				[type]: id
			}
		});

	return {
		type: 'helper',
		tables: ['trash'],
		success: dataResult === 1
	};
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
	const inventories: number[] = [];

	if (dataResults && dataResults.length) {
		// filter novels, outlines, characters, locations
		dataResults.forEach((result: DataModel) => {
			const { novel_id, outline_id, character_id, loc_id, inventory_id } = result.dataValues;
			/**
			 * each array does not conflict with each other
			 * which is based on the database structure
			 */
			if (novel_id) novels.push(novel_id);
			if (outline_id) outlines.push(outline_id);
			if (character_id) characters.push(character_id);
			if (loc_id) locations.push(loc_id);
			if (inventory_id) inventories.push(inventory_id);
		});
	}

	return { novels, outlines, characters, locations, inventories };
};

// add current novel/outline/character/location to trash table
export const addTrash = async (props: TrashTemplate): Promise<WriteDataModel> => {
	const dataResult: DataModel = await Trash.create(props);
	const result: WriteDataModel = {
		type: 'create',
		tables: ['trash'],
		success: false
	};
	if (dataResult) result.success = true;

	return result;
};

/**
 * put back novel
 * 1) update novel's deleted field to be 0
 * 2) delete novel from trash
 */
export const putbackNovel = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		deleteTrashHelper(id, 'novel_id'),
		updateNovel(id, { deleted: 0 })
	]);

	return {
		type: 'back',
		tables: ['novel', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

/**
 * put back outline
 * 1) update outline's deleted field to be 0
 * 2) delete outline from trash
 */
export const putbackOutline = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		deleteTrashHelper(id, 'outline_id'),
		updateOutline(id, { deleted: 0 })
	]);

	return {
		type: 'back',
		tables: ['outline', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

/**
 * put back character
 * 1) update character's deleted field to be 0
 * 2) delete character from trash
 */
export const putbackCharacter = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		deleteTrashHelper(id, 'character_id'),
		updateCharacter(id, { deleted: 0 })
	]);

	return {
		type: 'back',
		tables: ['character', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

/**
 * put back location
 * 1) update location's deleted field to be 0
 * 2) delete location from trash
 */
export const putbackLocation = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		deleteTrashHelper(id, 'loc_id'),
		updateLocation(id, { deleted: 0 })
	]);

	return {
		type: 'back',
		tables: ['location', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

/**
 * put back inventory
 * 1) update inventory's deleted field to be 0
 * 2) delete inventory from trash
 */
export const putbackInventory = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		deleteTrashHelper(id, 'inventory_id'),
		updateInventory(id, { deleted: 0 })
	]);

	return {
		type: 'back',
		tables: ['inventory', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};
