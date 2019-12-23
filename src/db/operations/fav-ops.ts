import Favorite from '../models/Favorite';
import { getAllNonDeletedOutlinesRange, updateOutlineFav, updateOutline } from '../operations/outline-ops';

// antd
import { message as Message } from 'antd';

// type declaration
import { FavoriteDataValue } from '../../renderer/components/favorite/favoriteDec';
import { DatabaseError } from 'sequelize';

/**
 * helper functions
 */
// delete outline from favorite table
export const deleteFavoriteHelper = (id: string | number): Promise<any> => {
	return Favorite
		.destroy({
			where: {
				outline_id: id
			}
		});
};

// add current outline to favorite table
const addFavoriteHelper = (id: string | number): Promise<any> => {
	return Favorite
		.create({
			outline_id: id
		});
};

/**
 * functions to use
 */
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

// get title and description for all outlines in favorites
export const findAllFavDetail = async (): Promise<any> => {
	const result: any = await Favorite.findAll();
	const outlines: string[] = result.map(({ dataValues }: { dataValues: FavoriteDataValue }) => {
		return dataValues.outline_id;
	});

	// grab title and description for those outlines
	return getAllNonDeletedOutlinesRange(outlines);
};

// cancel favorite and update outline table
export const cancelFavorite = (id: string | number): Promise<any> => {
	return Promise
		.all([deleteFavoriteHelper(id), updateOutlineFav(id, 0)])
		.then(() => {
			// alert success
			Message.success('已取消收藏！');
			return Promise.resolve();
		})
		.catch((err: DatabaseError) => {
			// alert error
			Message.error(err.message);
		});
};

// add to favorite and update outline
export const addFavorite = (id: string | number): Promise<any> => {
	return Promise
		.all([
			updateOutline(id, { fav: 1 }),
			addFavoriteHelper(id)
		]);
};
