import OutlineDetails from '../models/OutlineDetails';

// get all outline details given outline id
export const getAllOutlineDetails = (id: string): Promise<any> => {
	return OutlineDetails
		.findAll({
			where: {
				outline_id: id
			}
		});
};

// create new outline detail
export const createOutlineDetail = (id: string, c_id: number, t_id: number, contentText: string): Promise<any> => {
	return OutlineDetails
		.create({
			outline_id: id,
			character_id: c_id,
			timeline_id: t_id,
			content: contentText
		});
};

// update outline detail
export const updateOutlineDetail = (id: string | number | undefined, contentText: string): Promise<any> => {
	return OutlineDetails
		.update(
			{ content: contentText },
			{ where: { id } }
		);
};

// delete all outline details related to a character
export const deleteOutlineDetailsGivenChar = (character_id: number | string): Promise<any> => {
	return OutlineDetails
		.destroy({
			where: {
				character_id
			}
		});
};
