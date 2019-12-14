import Novel from '../models/Novels';

// get all novels
export const getAllNovels = (): Promise<any> => {
	return Novel.findAll();
};

export const getNovelById = (id: number | string): Promise<any> => {
	return Novel
		.findOne({
			where: {
				id
			}
		});
};
