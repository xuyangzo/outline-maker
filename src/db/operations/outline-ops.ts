import Outlines from '../models/Outlines';

// get outline given id
export const getOutline = (id: string): Promise<any> => {
	return Outlines
		.findOne({
			where: {
				id
			}
		});
};

// get all outlines
export const getAllOutlines = (): Promise<any> => {
	return Outlines
		.findAll({
			order: [['id', 'DESC']]
		});
};

// get outlines given array
export const getOutlinesRange = (outlines: number[]): Promise<any> => {
	return Outlines.
		findAll({
			where: { id: outlines },
			order: [['updatedAt', 'DESC']]
		});
};

// update outline scaling
export const updateScaling = (id: string | number, scaling: string): Promise<any> => {
	return Outlines
		.update(
			{ scaling },
			{ where: { id } }
		);
};

// update outline's fav property
export const updateOutlineFav = (id: string | number, fav: number): Promise<any> => {
	return Outlines
		.update(
			{ fav },
			{ where: { id } }
		);
};

// update outline's deleted property
export const updateDeleted = (id: string | number, deleted: number): Promise<any> => {
	return Outlines
		.update(
			{ deleted },
			{ where: { id } }
		);
};

// permanent deletion
export const deleteOutline = (id: string | number): Promise<any> => {
	return Outlines
		.destroy({
			where: {
				id
			}
		});
};
