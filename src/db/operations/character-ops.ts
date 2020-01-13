import CharacterModel from '../models/Character';
import { addTrash } from '../operations/trash-ops';
const Op = require('sequelize').Op;

interface CharacterTemplate {
	outline_id?: number | string;
	novel_id?: number | string;
	name?: string;
	image?: string;
	age?: string;
	nickname?: string;
	gender?: number;
	height?: string;
	identity?: string;
	appearance?: string;
	characteristics?: string;
	experience?: string;
	color?: string;
	deleted?: number;
	novelPageOrder?: number;
}

// get character given character id
export const getCharacter = (id: string | number): Promise<any> => {
	return CharacterModel
		.findOne({
			where: { id }
		});
};

// get id and name of character given character id
export const getCharacterShort = (id: string | number): Promise<any> => {
	return CharacterModel
		.findOne({
			attributes: ['id', 'name'],
			where: { id }
		});
};

// get all characters given novel id
export const getAllCharactersGivenNovel = (id: string | number): Promise<any> => {
	return CharacterModel
		.findAll({
			where: {
				novel_id: id,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});
};

// get all characters given outline id
export const getAllCharactersGivenOutline = (id: string): Promise<any> => {
	return CharacterModel
		.findAll({
			where: {
				outline_id: id,
				deleted: {
					[Op.ne]: 1
				}
			}
		});
};

// create new character
export const createCharacter = async (props: CharacterTemplate): Promise<any> => {
	// get the max order
	const maxOrder: number | null = await CharacterModel.max('novelPageOrder', { where: { novel_id: props.novel_id } });
	return CharacterModel
		.create({
			...props,
			novelPageOrder: (maxOrder || 0) + 1
		});
};

// update character with given props
export const updateCharacter = (id: string | number, props: CharacterTemplate) => {
	return CharacterModel
		.update(
			props,
			{ where: { id } }
		);
};

// update charater given outline_id
export const updateCharacterGivenOutline = (outline_id: string | number, props: CharacterTemplate) => {
	return CharacterModel
		.update(
			props,
			{ where: { outline_id } }
		);
};

// delete character temporarily
export const deleteCharacterTemp = (id: string | number): Promise<any> => {
	return Promise.all([
		addTrash({ character_id: id }),
		updateCharacter(id, { deleted: 1 })
	]);
};

/**
 * delete character permanently
 * already set CASCADE in relations, so just need to directly destroy
 */
export const deleteCharacterPermanently = async (id: string | number): Promise<any> => {
	return CharacterModel
		.destroy({
			where: { id }
		});
};
