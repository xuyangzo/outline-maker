import LocationModal from '../models/Location';
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
}

// get all locations given novel id
export const getAllLocationsByNovel = (novel_id: string | number): Promise<any> => {
	return LocationModal
		.findAll({
			where: {
				novel_id,
				deleted: {
					[Op.ne]: 1
				}
			}
		});
};

// get location given id
export const getLocation = (id: string | number): Promise<any> => {
	return LocationModal
		.findOne({
			where: { id }
		});
};

// get location id and name given id
export const getLocationShort = (id: string | number): Promise<any> => {
	return LocationModal
		.findOne({
			attributes: ['id', 'name'],
			where: { id }
		});
};

// update location
export const updateLocation = (id: string | number, props: LocationTemplate): Promise<any> => {
	return LocationModal
		.update(
			props,
			{ where: { id } }
		);
};

// create location
export const createLocation = (props: LocationTemplate): Promise<any> => {
	return LocationModal.create(props);
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
	return LocationModal
		.destroy({
			where: { id }
		});
};
