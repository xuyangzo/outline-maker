import LocationModal from '../models/Location';

// get all locations given id
export const getAllLocationsByNovel = (novel_id: string | number) => {
	return LocationModal
		.findAll({
			where: {
				novel_id
			}
		});
};
