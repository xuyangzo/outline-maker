import CharacterModal from '../models/Character';

// get all characters given outline id
export const getAllCharacters = (id: string): Promise<any> => {
	return CharacterModal
		.findAll({
			where: {
				outline_id: id
			}
		});
};

// create new character
export const createCharacter = (id: string, name: string, color: string): Promise<any> => {
	return CharacterModal
		.create({
			name,
			color,
			outline_id: id,
		});
};

// update current character
export const updateCharacter = (id: string | number, name: string): Promise<any> => {
	return CharacterModal
		.update(
			{ name },
			{ where: { id } }
		);
};
