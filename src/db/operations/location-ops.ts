import LocationModal from '../models/Location';

type LocationProps = {
	name?: string,
	image?: string,
	intro?: string,
	texture?: string,
	location?: string,
	controller?: string
};

// get all locations given novel id
export const getAllLocationsByNovel = (novel_id: string | number): Promise<any> => {
	return LocationModal
		.findAll({
			where: {
				novel_id
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

// update location detail
export const updateLocationDetail = (id: string | number, props: LocationProps): Promise<any> => {
	return LocationModal
		.update(
			{ ...props },
			{ where: { id } }
		);
};

type LocationTemplate = {
	name: string
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
