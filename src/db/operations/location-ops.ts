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
