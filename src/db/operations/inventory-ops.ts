import InventoryModel from '../models/Inventories';
const Op = require('sequelize').Op;
import { addTrash } from './trash-ops';

// type declaration
import { NovelInventoryDataValue } from '../../renderer/components/novel-inventory/novelInventoryDec';

interface InventoryTemplate {
	novel_id?: string;
	name?: string;
	image?: string;
	description?: string;
	category?: string;
	deleted?: number;
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

// create new inventory
export const createInventory = async (props: InventoryTemplate): Promise<WriteDataModel> => {
	const inventory: DataModel = await InventoryModel.create(props);

	const result: WriteDataModel = {
		type: 'create',
		tables: ['inventory'],
		success: false
	};
	if (inventory) {
		result.id = inventory.dataValues.id;
		result.success = true;
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
		// addTrash({ inventory_id: id })
	]);

	return {
		type: 'deleteT',
		tables: ['inventory', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
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
