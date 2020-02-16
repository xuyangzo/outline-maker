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
export const updateLocation = (id: string | number, props: LocationTemplate): Promise<DataUpdateResult> => {
	return LocationModel
		.update(
			props,
			{ where: { id } }
		);
};

// create location
export const createLocation = async (props: LocationTemplate): Promise<DataUpdateResult> => {
	// get the max order
	const maxOrder: number | null = await LocationModel.max('novelPageOrder', { where: { novel_id: props.novel_id } });
	return LocationModel
		.create({
			...props,
			novelPageOrder: (maxOrder || 0) + 1
		});
};

// delete location temporarily
export const deleteLocationTemp = (id: string | number): Promise<DataUpdateResults> => {
	return Promise.all([
		addTrash({ loc_id: id }),
		updateLocation(id, { deleted: 1 })
	]);
};

// delete location
export const deleteLocationPermanently = (id: string | number): Promise<DataUpdateResult> => {
	return LocationModel
		.destroy({
			where: { id }
		});
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
