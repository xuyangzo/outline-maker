import LocationModal from '../models/Location';

// get all locations given novel id
export const getAllLocationsByNovel = (novel_id: string | number) => {
	return LocationModal
		.findAll({
			where: {
				novel_id
			}
		});
};

// get location given id
export const getLocation = (id: string | number) => {
	return LocationModal
		.findOne({
			where: {
				id
			}
		});
};
