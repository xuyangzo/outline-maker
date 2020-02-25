import InventoryModel from '../models/Inventories';
const Op = require('sequelize').Op;
import { addTrash } from './trash-ops';
import { addInventoryToCharacter } from './character-inventory-ops';

// type declaration
import { NovelInventoryDataValue } from '../../renderer/components/novel-inventory/novelInventoryDec';
import { TrashInventoryDataValue } from '../../renderer/components/trash/inventory-trash/inventoryTrashDec';

export interface InventoryTemplate {
	novel_id?: string;
	name?: string;
	image?: string;
	description?: string;
	category?: string;
	deleted?: number;
	masters?: string[];
}

// get all inventories
export const getAllInventoriesGivenNovel = async (id: number | string): Promise<NovelInventoryDataValue[]> => {
	const dataResults: DataResults = await InventoryModel
		.findAll({
			attributes: ['id', 'name', 'image', 'description'],
			where: {
				novel_id: id,
				deleted: 0
			}
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

/**
 * helper function
 * get inventory id and name given id
 */
const getInventoryHelper = (id: string | number): Promise<DataModel> => {
	return InventoryModel
		.findOne({
			attributes: ['id', 'name'],
			where: { id }
		});
};

// get all inventories by their id
export const getAllInventoriesGivenIdList = async (idList: (string | number)[]): Promise<TrashInventoryDataValue[]> => {
	const promises: Promise<DataModel>[] = idList.map((invId: number | string) => {
		return getInventoryHelper(invId);
	});

	const dataResults: DataResults = await Promise.all(promises);
	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// create new inventory
export const createInventory = async (props: InventoryTemplate): Promise<WriteDataModel> => {
	const { masters, ...nextProps } = props;
	// create inventory
	const inventory: DataModel = await InventoryModel.create(nextProps);
	// add relations to character-inventory table
	const promises: Promise<WriteDataModel>[] = [];
	if (masters && masters.length) {
		masters.forEach((character_id: string) => {
			promises.push(
				addInventoryToCharacter(character_id, inventory.dataValues.id)
			);
		});
	}

	const newResults: WriteDataModel[] = await Promise.all(promises);

	const result: WriteDataModel = {
		type: 'create',
		tables: ['inventory'],
		success: newResults.every((result: WriteDataModel) => result.success)
	};
	if (inventory) {
		result.id = inventory.dataValues.id;
		result.success = result.success && true;
	}

	return result;
};

// update inventory
export const updateInventory = async (id: string | number, props: InventoryTemplate): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await InventoryModel
		.update(
			props,
			{ where: { id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['inventory'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};

// temporarily delete inventory
export const deleteInventoryTemp = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		updateInventory(id, { deleted: 1 }),
		addTrash({ inventory_id: id })
	]);

	return {
		type: 'deleteT',
		tables: ['inventory', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

// permanently delete inventory
export const deleteInventoryPermanently = async (id: string | number): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await InventoryModel
		.destroy({
			where: { id }
		});

	return {
		type: 'deleteP',
		tables: ['inventory'],
		success: dataResult === 1
	};
};

export const searchInventory = async (novel_id: string | number, key: string): Promise<NovelInventoryDataValue[]> => {
	if (key === '') return getAllInventoriesGivenNovel(novel_id);

	const dataResults: DataResults = await InventoryModel
		.findAll({
			attributes: ['id', 'name', 'image', 'description'],
			where: {
				novel_id,
				[Op.or]: [
					{
						name: {
							[Op.like]: '%'.concat(key).concat('%')
						}
					},
					{
						description: {
							[Op.like]: '%'.concat(key).concat('%')
						}
					}
				],
				deleted: {
					[Op.ne]: 1
				}
			}
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};
