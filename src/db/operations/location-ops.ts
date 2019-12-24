import LocationModal from '../models/Location';
const Op = require('sequelize').Op;
import { addTrash } from './trash-ops';

interface LocationTemplate {
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
			where: {
				id
			}
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
export const createLocation = (novel_id: string | number, props: LocationTemplate): Promise<any> => {
	return LocationModal
		.create({
			novel_id,
			...props
		});
};

// delete location
export const deleteLocation = (id: string | number): Promise<any> => {
	return LocationModal
		.destroy({
			where: { id }
		});
};

// delete location temporarily
export const deleteLocationTemp = (id: string | number): Promise<any> => {
	return Promise.all([
		addTrash({ loc_id: id }),
		updateLocation(id, { deleted: 1 })
	]);
};
