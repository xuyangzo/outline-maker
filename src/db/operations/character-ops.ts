import CharacterModel from '../models/Character';
import CharacterOutlineModel from '../models/CharacterOutlines';
import CharacterInventoryModel from '../models/CharacterInventories';
import { addCharacterToOutline } from './character-outline-ops';
import { addTrash } from './trash-ops';
const Op = require('sequelize').Op;

// type declaration
import { CharacterTrashDataValue } from '../../renderer/components/trash/character-trash/characterTrashDec';
import { NovelCharacterDataValues } from '../../renderer/components/novel-character/novelCharacterDec';
import { CharacterMainDataValue } from '../../renderer/components/main-header/character-modal/characterModalDec';
import { MainCharacterDataValue } from '../../renderer/components/main/mainDec';
import { CharacterDataValue } from '../../renderer/components/character/characterDec';
import {
	CharacterInventoryDataValue
} from '../../renderer/components/novel-inventory/inventory-modal/inventoryModalDec';

// utils
import { imageMapping } from '../../renderer/utils/constants';

interface CharacterTemplate {
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
	note?: string;
	color?: string;
	deleted?: number;
	isMain?: number;
	novelPageOrder?: number;
}

// get character given character id
export const getCharacter = async (id: string | number): Promise<CharacterDataValue> => {
	const dataResult: DataResult = await CharacterModel
		.findOne({
			attributes: [
				'name', 'image', 'age', 'nickname', 'gender', 'note',
				'height', 'identity', 'appearance', 'characteristics', 'experience'
			],
			where: { id }
		});

	const data: CharacterDataValue = {
		name: '找不到该角色！',
		image: '',
		age: '',
		nickname: '',
		gender: 0,
		note: '',
		height: '',
		identity: '',
		appearance: '',
		characteristics: '',
		experience: ''
	};
	if (dataResult) {
		const {
			name, image, age, nickname, gender, note, height,
			identity, appearance, characteristics, experience
		} = dataResult.dataValues;

		/**
		 * filter null properties
		 * in order for edit page
		 */
		if (name) data.name = name;
		if (image) data.image = image;
		if (age) data.age = age;
		if (nickname) data.nickname = nickname;
		if (gender) data.gender = gender;
		if (note) data.note = note;
		if (height) data.height = height;
		if (identity) data.identity = identity;
		if (appearance) data.appearance = appearance;
		if (characteristics) data.characteristics = characteristics;
		if (experience) data.experience = experience;
	}
	return data;
};

// get certain attributes of character given character id
export const getCharacterSimple = async (id: string | number): Promise<MainCharacterDataValue> => {
	const dataResult: DataResult = await CharacterModel
		.findOne({
			attributes: ['id', 'name', 'color'],
			where: { id }
		});

	const data: MainCharacterDataValue = {
		id: -1,
		name: '找不到该角色！',
		color: ''
	};
	if (dataResult) {
		const { id, name, color } = dataResult.dataValues;
		if (id) data.id = id;
		if (name) data.name = name;
		if (color) data.color = color;
	}

	return data;
};

/**
 * helper function
 * get character id and name given id
 */
const getCharacterHelper = (id: string | number): Promise<DataModel> => {
	return CharacterModel
		.findOne({
			attributes: ['id', 'name'],
			where: { id }
		});
};

// get all characters given id list
export const getAllCharactersGivenIdList = async (idList: (string | number)[]): Promise<CharacterTrashDataValue[]> => {
	const promises: Promise<DataModel>[] = idList.map((characterId: string | number) => {
		return getCharacterHelper(characterId);
	});

	const dataResults: DataResults = await Promise.all(promises);
	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// get all characters given novel id
export const getAllCharactersGivenNovel = async (id: string | number): Promise<NovelCharacterDataValues> => {
	const dataResults: DataResults = await CharacterModel
		.findAll({
			attributes: ['id', 'name', 'image', 'gender', 'isMain'],
			where: {
				novel_id: id,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});

	const data: NovelCharacterDataValues = {
		main: [],
		sub: []
	};
	if (dataResults && dataResults.length) {
		dataResults.forEach((result: DataModel) => {
			const { id, name, image, gender, isMain } = result.dataValues;
			if (isMain) data.main.push({ id, name, gender, image: imageMapping(gender, image) });
			else data.sub.push({ id, name, gender, image: imageMapping(gender, image) });
		});
	}

	return data;
};

// get all characters given outline id
export const getAllCharactersGivenOutline = async (id: string): Promise<MainCharacterDataValue[]> => {
	const dataResults: DataResults = await CharacterModel
		.findAll({
			attributes: ['id', 'name', 'color'],
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

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// get all valid characters for outline importing
export const getAllValidCharactersForOutline = async (
	novel_id: string | number,
	outline_id: string | number
): Promise<CharacterMainDataValue[]> => {
	// get all invalid characters id
	const invalidCharactersData: DataResults = await CharacterModel
		.findAll({
			attributes: ['id'],
			where: {
				novel_id,
				deleted: 0
			},
			include: [{
				model: CharacterOutlineModel,
				required: true,
				where: {
					outline_id
				}
			}]
		});

	// get all valid characters by exclude all invalid characters
	const invalidCharacters: number[] = invalidCharactersData.map((data: DataModel) => data.dataValues.id);
	const dataResults: DataResults = await CharacterModel
		.findAll({
			attributes: ['id', 'name'],
			where: {
				novel_id,
				deleted: 0,
				character_id: {
					[Op.notIn]: invalidCharacters
				}
			}
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// get all valid characters for inventory
export const getAllValidCharactersForInventory = async (
	novel_id: string | number,
	inventory_id: string | number
): Promise<CharacterInventoryDataValue[]> => {
	// get all invalid characters id
	const invalidInventoriesData: DataResults = await CharacterModel
		.findAll({
			attributes: ['id'],
			where: {
				novel_id,
				deleted: 0
			},
			include: [{
				model: CharacterInventoryModel,
				required: true,
				where: {
					inventory_id
				}
			}]
		});

	// get all valid inventories by exclude all invalid inventories
	const invalidCharacters: number[] = invalidInventoriesData.map((data: DataModel) => data.dataValues.id);
	const dataResults: DataResults = await CharacterModel
		.findAll({
			attributes: ['id', 'name'],
			where: {
				novel_id,
				deleted: 0,
				character_id: {
					[Op.notIn]: invalidCharacters
				}
			}
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// create new character
export const createCharacter = async (props: CharacterTemplate): Promise<WriteDataModel> => {
	// get the max order
	const maxOrder: number | null = await CharacterModel.max('novelPageOrder', { where: { novel_id: props.novel_id } });
	const character: DataModel = await CharacterModel.create({
		...props,
		novelPageOrder: (maxOrder || 0) + 1
	});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['character'],
		success: false
	};
	if (character) {
		result.id = character.dataValues.id;
		result.success = true;
	}

	return result;
};

// create new character and add it to character outline table
export const createAndAddCharacterToOutline = async (
	props: CharacterTemplate, outline_id: string | number
): Promise<WriteDataModel> => {
	const dataResult: WriteDataModel = await createCharacter(props);

	const result: WriteDataModel = {
		type: 'create',
		tables: ['character', 'character-outline'],
		success: false,
		id: dataResult.id
	};
	if (dataResult.success) {
		const { id } = dataResult;
		if (id) {
			const dataResult2: WriteDataModel = await addCharacterToOutline(id, outline_id);
			if (dataResult2.success) result.success = true;
		}
	}
	return result;
};

// update character with given props
export const updateCharacter = async (id: string | number, props: CharacterTemplate): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await CharacterModel
		.update(
			props,
			{ where: { id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['character'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};

// update charater given outline_id
export const updateCharacterGivenOutline = async (
	outline_id: string | number, props: CharacterTemplate
): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await CharacterModel
		.update(
			props,
			{ where: { outline_id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['character'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};

// delete character temporarily
export const deleteCharacterTemp = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		addTrash({ character_id: id }),
		updateCharacter(id, { deleted: 1 })
	]);

	return {
		type: 'deleteT',
		tables: ['character', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

/**
 * delete character permanently
 * already set CASCADE in relations, so just need to directly destroy
 */
export const deleteCharacterPermanently = async (id: string | number): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await CharacterModel
		.destroy({
			where: { id }
		});

	return {
		type: 'deleteP',
		tables: ['character'],
		success: dataResult === 1
	};
};

// search characters
export const searchCharacter = async (novel_id: string | number, key: string): Promise<NovelCharacterDataValues> => {
	if (key === '') return getAllCharactersGivenNovel(novel_id);

	const dataResults: DataResults = await CharacterModel
		.findAll({
			attributes: ['id', 'name', 'image', 'gender', 'isMain'],
			where: {
				novel_id,
				name: {
					[Op.like]: '%'.concat(key).concat('%')
				},
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});

	const data: NovelCharacterDataValues = {
		main: [],
		sub: []
	};
	if (dataResults && dataResults.length) {
		dataResults.forEach((result: DataModel) => {
			const { id, name, image, gender, isMain } = result.dataValues;
			if (isMain) data.main.push({ id, name, gender, image: imageMapping(gender, image) });
			else data.sub.push({ id, name, gender, image: imageMapping(gender, image) });
		});
	}

	return data;
};
