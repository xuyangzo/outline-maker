import Trash from '../models/Trash';

// get all trashes
export const getAllTrashes = (): Promise<any> => {
	return Trash.findAll();
};

// add current outline to trash table
export const addTrash = (id: string): Promise<any> => {
	return Trash
		.create({
			outline_id: id
		});
};

// delete outline from trash table
export const deleteTrash = (id: number): Promise<any> => {
	return Trash
		.destroy({
			where: {
				outline_id: id
			}
		});
};
