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
export const createInventory = (props: InventoryTemplate): Promise<any> => {
	return InventoryModel.create(props);
};

// update inventory
export const updateInventory = (id: string | number, props: InventoryTemplate): Promise<any> => {
	return InventoryModel
		.update(
			props,
			{ where: { id } }
		);
};

// temporarily delete inventory
export const deleteInventoryTemp = (id: string | number): Promise<any> => {
	return Promise.all([
		updateInventory(id, { deleted: 1 })
	]);
};
