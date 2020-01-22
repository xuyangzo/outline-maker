import CharacterModel from '../models/Character';
import CharacterOutlineModel from '../models/CharacterOutlines';
import { addTrash } from '../operations/trash-ops';
const Op = require('sequelize').Op;

interface CharacterTemplate {
	novel_id?: number | string;
	outline_id?: number | string;
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
	note?: string;
	color?: string;
	deleted?: number;
	isMain?: number;
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

// get all main characters given novel id
export const getAllMainCharactersGivenNovel = (id: string | number): Promise<any> => {
	return CharacterModel
		.findAll({
			where: {
				novel_id: id,
				deleted: {
					[Op.ne]: 1
				},
				isMain: 1
			},
			order: [['novelPageOrder', 'ASC']]
		});
};

// get all sub characters given novel id
export const getAllSubCharactersGivenNovel = (id: string | number): Promise<any> => {
	return CharacterModel
		.findAll({
			where: {
				novel_id: id,
				deleted: {
					[Op.ne]: 1
				},
				isMain: 0
			},
			order: [['novelPageOrder', 'ASC']]
		});
};

// get all characters given outline id
export const getAllCharactersGivenOutline = (id: string): Promise<any> => {
	return CharacterModel
		.findAll({
			where: {
				deleted: {
					[Op.ne]: 1
				}
			},
			include: [{
				model: CharacterOutlineModel,
				required: true,
				where: {
					outline_id: id
				}
			}]
		});
};

// get all valid characters for outline importing
export const getAllValidCharacters = async (novel_id: string, outline_id: string): Promise<any> => {
	// get all invalid characters
	const invalidCharactersData = await CharacterModel
		.findAll({
			attributes: ['id'],
			where: {
				novel_id,
				deleted: {
					[Op.ne]: 1
				}
			},
			include: [{
				model: CharacterOutlineModel,
				required: true,
				where: {
					outline_id
				}
			}]
		});

	// get all invalid characters
	const invalidCharacters: number[] = invalidCharactersData.map((data: any) => data.dataValues.id);
	return CharacterModel
		.findAll({
			where: {
				novel_id,
				deleted: {
					[Op.ne]: 1
				},
				character_id: {
					[Op.notIn]: invalidCharacters
				}
			}
		});
};

// get all characters' names and ids given outline id
export const getAllCharactersGivenOutlineShort = (id: string): Promise<any> => {
	return CharacterModel
		.findAll({
			attributes: ['name', 'id'],
			where: {
				deleted: {
					[Op.ne]: 1
				}
			},
			include: {
				model: CharacterOutlineModel,
				required: true,
				where: {
					outline_id: id
				}
			}
		});
};

// create new character
export const createCharacter = async (props: CharacterTemplate): Promise<any> => {
	const { outline_id, ...characterProps } = props;
	// get the max order
	const maxOrder: number | null = await CharacterModel.max('novelPageOrder', { where: { novel_id: props.novel_id } });
	const character = await CharacterModel.create({
		...characterProps,
		novelPageOrder: (maxOrder || 0) + 1
	});
	return CharacterOutlineModel
		.create({
			outline_id,
			character_id: character.dataValues.id
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

// search main character
export const searchMainCharacter = (novel_id: string | number, key: string): Promise<any> => {
	if (key === '') return getAllMainCharactersGivenNovel(novel_id);

	return CharacterModel
		.findAll({
			where: {
				novel_id,
				name: {
					[Op.like]: '%'.concat(key).concat('%')
				},
				isMain: 1,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});
};

// search sub characters
export const searchSubCharacter = (novel_id: string | number, key: string): Promise<any> => {
	if (key === '') return getAllSubCharactersGivenNovel(novel_id);

	return CharacterModel
		.findAll({
			where: {
				novel_id,
				name: {
					[Op.like]: '%'.concat(key).concat('%')
				},
				isMain: 0,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});
};
