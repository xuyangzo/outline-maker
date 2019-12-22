import BackgroundModal from '../models/Background';

// type declaration
import { Background as BackgroundTemplate } from '../../renderer/components/background/backgroundDec';

// get only worldview given novel id
export const getWorldviewGivenNovel = (id: string | number): Promise<any> => {
	return BackgroundModal
		.findOne({
			where: {
				novel_id: id,
				title: '世界观'
			}
		});
};

// get all backgrounds given novel id
export const getBackgroundsGivenNovel = (id: string | number): Promise<any> => {
	return BackgroundModal
		.findAll({
			where: {
				novel_id: id
			}
		});
};

interface BackgroundCreateTemplate {
	title: string;
	content: string;
}

// update a background given novel id
const updateBackground = (id: string | number, props: BackgroundCreateTemplate): Promise<any> => {
	return BackgroundModal
		.update(
			props,
			{ where: { id } }
		);
};

// create a new background
const createBackground = (id: string | number, props: BackgroundCreateTemplate): Promise<any> => {
	return BackgroundModal
		.create({
			...props,
			novel_id: id
		});
};

// do update and create at the same time
export const createAndUpdateBackgrounds = (id: string | number, lists: BackgroundTemplate[]): Promise<any> => {
	const promises: Promise<any>[] = [];
	lists.forEach((background: BackgroundTemplate) => {
		if (background.created) promises.push(createBackground(id, { title: background.title, content: background.content }));
		else if (background.updated) {
			promises.push(
				updateBackground(
					background.id,
					{ title: background.title, content: background.content }
				)
			);
		}
	});

	return Promise.all(promises);
};
