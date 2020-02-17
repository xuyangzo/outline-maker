import InventoryModel from '../models/Inventories';
const Op = require('sequelize').Op;

interface InventoryTemplate {
	novel_id?: string;
	name?: string;
	image?: string;
	description?: string;
	category?: string;
	deleted?: number;
}

// get all inventories
export const getAllInventoriesGivenNovel = (id: number | string): Promise<any> => {
	return InventoryModel
		.findAll({
			where: {
				novel_id: id,
				deleted: {
					[Op.ne]: 1
				}
			}
		});
};

// create new inventory
export const createInventory = (props: InventoryTemplate): Promise<DataUpdateResult> => {
	return InventoryModel.create(props);
};

// update inventory
export const updateInventory = (id: string | number, props: InventoryTemplate): Promise<DataUpdateResult> => {
	return InventoryModel
		.update(
			props,
			{ where: { id } }
		);
};

// temporarily delete inventory
export const deleteInventoryTemp = (id: string | number): Promise<DataUpdateResults> => {
	return Promise.all([
		updateInventory(id, { deleted: 1 })
	]);
};
