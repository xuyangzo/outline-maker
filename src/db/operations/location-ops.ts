import LocationModel from '../models/Location';
const Op = require('sequelize').Op;
import { addTrash } from './trash-ops';

// type declaration
import { NovelLocationDataValue } from '../../renderer/components/novel-location/novelLocationDec';
import { TrashLocationDataValue } from '../../renderer/components/trash/location-trash/locationTrashDec';
import { LocationDataValue } from '../../renderer/components/location/locationDec';

interface LocationTemplate {
	novel_id?: string;
	name?: string;
	image?: string;
	intro?: string;
	texture?: string;
	location?: string;
	controller?: string;
	deleted?: number;
	novelPageOrder?: number;
}

// get all locations given novel id
export const getAllLocationsGivenNovel = async (novel_id: string | number): Promise<NovelLocationDataValue[]> => {
	const dataResults: DataResults = await LocationModel
		.findAll({
			attributes: ['id', 'name', 'image'],
			where: {
				novel_id,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// get location given id
export const getLocation = async (id: string | number): Promise<LocationDataValue> => {
	const dataResult: DataResult = await LocationModel
		.findOne({
			attributes: ['name', 'image', 'intro', 'texture', 'location', 'controller'],
			where: { id }
		});

	const data: LocationDataValue = {
		name: '找不到该势力！',
		image: '',
		intro: '',
		texture: '',
		location: '',
		controller: ''
	};
	if (dataResult) {
		const { name, image, intro, texture, location, controller } = dataResult.dataValues;

		/**
		 * filter null properties
		 * in order for edit page
		 */
		if (name) data.name = name;
		if (image) data.image = image;
		if (intro) data.intro = intro;
		if (texture) data.texture = texture;
		if (location) data.location = location;
		if (controller) data.controller = controller;
	}

	return data;
};

/**
 * helper function
 * get location id and name given id
 */
const getLocationHelper = (id: string | number): Promise<DataModel> => {
	return LocationModel
		.findOne({
			attributes: ['id', 'name'],
			where: { id }
		});
};

// get all locations by their id
export const getAllLocationsGivenIdList = async (idList: (string | number)[]): Promise<TrashLocationDataValue[]> => {
	const promises: Promise<DataModel>[] = idList.map((locId: number | string) => {
		return getLocationHelper(locId);
	});

	const dataResults: DataResults = await Promise.all(promises);
	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// update location
export const updateLocation = async (id: string | number, props: LocationTemplate): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await LocationModel
		.update(
			props,
			{ where: { id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['location'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};

// create location
export const createLocation = async (props: LocationTemplate): Promise<WriteDataModel> => {
	// get the max order
	const maxOrder: number | null = await LocationModel.max('novelPageOrder', { where: { novel_id: props.novel_id } });
	const location: DataModel = await LocationModel
		.create({
			...props,
			novelPageOrder: (maxOrder || 0) + 1
		});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['location'],
		success: false
	};
	if (location) {
		result.id = location.dataValues.id;
		result.success = true;
	}

	return result;
};

// delete location temporarily
export const deleteLocationTemp = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise.all([
		addTrash({ loc_id: id }),
		updateLocation(id, { deleted: 1 })
	]);

	return {
		type: 'deleteT',
		tables: ['location', 'trash'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

// delete location
export const deleteLocationPermanently = async (id: string | number): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await LocationModel
		.destroy({
			where: { id }
		});

	return {
		type: 'deleteP',
		tables: ['location'],
		success: dataResult === 1
	};
};

// search location
export const searchLocation = async (novel_id: string | number, key: string): Promise<NovelLocationDataValue[]> => {
	// if the keyword is empty, return all locations
	if (key === '') return getAllLocationsGivenNovel(novel_id);

	const dataResults: DataResults = await LocationModel
		.findAll({
			attributes: ['id', 'name', 'image'],
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

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};
