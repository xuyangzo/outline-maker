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
export const updateCharacter = (id: string | number, name: string, color: string): Promise<any> => {
	const modalToUpdate: { name?: string, color?: string } = {};
	if (name) modalToUpdate.name = name;
	if (color) modalToUpdate.color = color;
	return CharacterModal
		.update(
			modalToUpdate,
			{ where: { id } }
		);
};

// delete character
export const deleteCharacter = async (id: string | number): Promise<any> => {
	await deleteOutlineDetailsGivenChar(id);
	return CharacterModal
		.destroy({
			where: { id }
		});
};
