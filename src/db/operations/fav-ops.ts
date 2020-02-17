import FavoriteModel from '../models/Favorite';
import { getOutlinesGivenIdRange, updateOutline } from '../operations/outline-ops';

// type declaration
import { FavoriteDataValue } from '../../renderer/components/favorite/favoriteDec';

/**
 * helper functions
 */
// delete outline from favorite table
export const deleteFavoriteHelper = async (id: string | number): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await FavoriteModel
		.destroy({
			where: {
				outline_id: id
			}
		});

	return {
		type: 'helper',
		tables: ['favorite'],
		success: dataResult === 1
	};
};

// add current outline to favorite table
const addFavoriteHelper = async (id: string | number): Promise<WriteDataModel> => {
	const dataResult: DataModel = await FavoriteModel
		.create({
			outline_id: id
		});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['favorite'],
		success: false
	};

	if (dataResult) result.success = true;

	return result;
};

/**
 * functions to use
 */
// find outline id from favorite table
export const isFavorite = async (id: string): Promise<boolean> => {
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
export const cancelFavorite = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise
		.all([
			deleteFavoriteHelper(id),
			updateOutline(id, { fav: 0 })
		]);

	return {
		type: 'update',
		tables: ['outline', 'favorite'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};

// add to favorite and update outline
export const addFavorite = async (id: string | number): Promise<WriteDataModel> => {
	const dataResults: WriteDataModel[] = await Promise
		.all([
			updateOutline(id, { fav: 1 }),
			addFavoriteHelper(id)
		]);

	return {
		type: 'update',
		tables: ['outline', 'favorite'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};
