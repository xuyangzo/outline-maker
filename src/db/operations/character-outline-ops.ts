import CharacterOutlineModel from '../models/CharacterOutlines';

// add character to outline
export const addCharacterToOutline = async (
	character_id: string | number, outline_id: string | number
): Promise<WriteDataModel> => {
	const dataResult: DataModel = await CharacterOutlineModel
		.create({
			character_id,
			outline_id
		});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['character-outline'],
		success: false
	};
	if (dataResult) {
		result.success = true;
	}

	return result;
};

// remove character from given outline
export const deleteCharacterFromOutline = async (
	character_id: string | number, outline_id: string | number
): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await CharacterOutlineModel
		.destroy({
			where: {
				character_id,
				outline_id
			}
		});

	return {
		type: 'create',
		tables: ['character-outline'],
		success: dataResult === 1
	};
};
