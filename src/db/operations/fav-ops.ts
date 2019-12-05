import Favorite from '../models/Favorite';

// find outline id from favorite table
export const findFavorite = (id: string): Promise<any> => {
	return Favorite
		.findOne({
			where: {
				outline_id: id
			}
		});
};

// find all favorites
export const findAllFav = (): Promise<any> => {
	return Favorite.findAll();
};

// add current outline to favorite table
export const addFavorite = (id: string): Promise<any> => {
	return Favorite
		.create({
			outline_id: id
		});
};

// delete outline from favorite table
export const deleteFavorite = (id: string | number): Promise<any> => {
	return Favorite
		.destroy({
			where: {
				outline_id: id
			}
		});
};
