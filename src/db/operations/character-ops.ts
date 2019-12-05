import CharacterModal from '../models/Character';
import { deleteOutlineDetailsGivenChar } from './detail-ops';

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

// delete character
export const deleteCharacter = (id: string | number): Promise<any> => {
	return deleteOutlineDetailsGivenChar(id)
		.then(() => {
			CharacterModal
				.destroy({
					where: { id }
				});
		});
};
