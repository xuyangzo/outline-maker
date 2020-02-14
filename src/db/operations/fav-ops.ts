import FavoriteModel from '../models/Favorite';
import { getOutlinesGivenIdRange, updateOutlineFav, updateOutline } from '../operations/outline-ops';

// type declaration
import { FavoriteDataValue } from '../../renderer/components/favorite/favoriteDec';

/**
 * helper functions
 */
// delete outline from favorite table
export const deleteFavoriteHelper = (id: string | number): Promise<DataUpdateResult> => {
	return FavoriteModel
		.destroy({
			where: {
				outline_id: id
			}
		});
};

// add current outline to favorite table
const addFavoriteHelper = (id: string | number): Promise<DataUpdateResult> => {
	return FavoriteModel
		.create({
			outline_id: id
		});
};

/**
 * functions to use
 */
// find outline id from favorite table
export const findFavorite = async (id: string): Promise<boolean> => {
	const dataResult: DataResult = await FavoriteModel
		.findOne({
			where: {
				outline_id: id
			}
		});

	if (dataResult) return true;
	return false;
};

/**
 * helper function
 * find all favorites
 */
const getAllFavoritesIds = async (): Promise<number[]> => {
	const dataResults: DataResults = await FavoriteModel.findAll();

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues.outline_id);
	}

	return [];
};

// get title and description for all outlines in favorites
export const findAllFavDetail = async (): Promise<FavoriteDataValue[]> => {
	const outlineIds: number[] = await getAllFavoritesIds();

	// grab title and description for those outlines
	return getOutlinesGivenIdRange(outlineIds);
};

// cancel favorite and update outline table
export const cancelFavorite = (id: string | number): Promise<DataUpdateResults> => {
	return Promise
		.all([
			deleteFavoriteHelper(id),
			updateOutlineFav(id, 0)
		]);
};

// add to favorite and update outline
export const addFavorite = (id: string | number): Promise<DataUpdateResults> => {
	return Promise
		.all([
			updateOutline(id, { fav: 1 }),
			addFavoriteHelper(id)
		]);
};
