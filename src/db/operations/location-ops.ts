import LocationModel from '../models/Location';
const Op = require('sequelize').Op;
import { addTrash } from './trash-ops';

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
export const getAllLocationsGivenNovel = (novel_id: string | number): Promise<any> => {
	return LocationModel
		.findAll({
			where: {
				novel_id,
				deleted: {
					[Op.ne]: 1
				}
			},
			order: [['novelPageOrder', 'ASC']]
		});
};

// get location given id
export const getLocation = (id: string | number): Promise<any> => {
	return LocationModel
		.findOne({
			where: { id }
		});
};

// get location id and name given id
export const getLocationShort = (id: string | number): Promise<any> => {
	return LocationModel
		.findOne({
			attributes: ['id', 'name'],
			where: { id }
		});
};

// update location
export const updateLocation = (id: string | number, props: LocationTemplate): Promise<any> => {
	return LocationModel
		.update(
			props,
			{ where: { id } }
		);
};

// create location
export const createLocation = async (props: LocationTemplate): Promise<any> => {
	// get the max order
	const maxOrder: number | null = await LocationModel.max('novelPageOrder', { where: { novel_id: props.novel_id } });
	return LocationModel
		.create({
			...props,
			novelPageOrder: (maxOrder || 0) + 1
		});
};

// delete location temporarily
export const deleteLocationTemp = (id: string | number): Promise<any> => {
	return Promise.all([
		addTrash({ loc_id: id }),
		updateLocation(id, { deleted: 1 })
	]);
};

// delete location
export const deleteLocationPermanently = (id: string | number): Promise<any> => {
	return LocationModel
		.destroy({
			where: { id }
		});
};

// search location
export const searchLocation = (novel_id: string | number, key: string): Promise<any> => {
	if (key === '') return getAllLocationsGivenNovel(novel_id);

	return LocationModel
		.findAll({
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
};
