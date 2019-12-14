import Novel from '../models/Novels';

// type declaration
import { CreateNovelModalTemplate } from '../../renderer/components/sidebar/sidebarDec';

// get all novels
export const getAllNovels = (): Promise<any> => {
	return Novel.findAll({
		order: [['id', 'DESC']]
	});
};

// get novel given id
export const getNovelById = (id: number | string): Promise<any> => {
	return Novel
		.findOne({
			where: {
				id
			}
		});
};

// create new novel
export const createNovel = (model: CreateNovelModalTemplate): Promise<any> => {
	return Novel.create(model);
};
