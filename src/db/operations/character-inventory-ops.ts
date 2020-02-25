import CharacterInventoryModel from '../models/CharacterInventories';

// add inventory to outline
export const addInventoryToCharacter = async (
	character_id: string | number, inventory_id: string | number
): Promise<WriteDataModel> => {
	const dataResult: DataModel = await CharacterInventoryModel
		.create({
			character_id,
			inventory_id
		});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['character-inventory'],
		success: false
	};
	if (dataResult) {
		result.success = true;
	}

	return result;
};

// remove character from given outline
// export const deleteCharacterFromOutline = async (
// 	character_id: string | number, outline_id: string | number
// ): Promise<WriteDataModel> => {
// 	const dataResult: DataDeleteResult = await CharacterOutlineModel
// 		.destroy({
// 			where: {
// 				character_id,
// 				outline_id
// 			}
// 		});

// 	return {
// 		type: 'create',
// 		tables: ['character-outline'],
// 		success: dataResult === 1
// 	};
// };
