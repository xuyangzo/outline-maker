import BackgroundModal from '../models/Background';

// type declaration
import { BackgroundDataValue } from '../../renderer/components/background/backgroundDec';

interface BackgroundCreateAndUpdateTemplate {
	title?: string;
	content?: string;
}

interface BackgroundTemplate extends BackgroundCreateAndUpdateTemplate {
	id: string | number;
	created?: boolean;
	updated?: boolean;
	deleted?: boolean;
}

// get only worldview given novel id
export const getWorldviewGivenNovel = async (id: string | number): Promise<string> => {
	const dataModel: DataResult = await BackgroundModal
		.findOne({
			attributes: ['content'],
			where: {
				novel_id: id,
				title: '世界观'
			}
		});

	// dataModel might be null here
	if (dataModel) return dataModel.dataValues.content;
	return '暂时还没有世界观设定...';
};

// get all backgrounds given novel id
export const getBackgroundsGivenNovel = async (id: string | number): Promise<BackgroundDataValue[]> => {
	const dataResults: DataResults = await BackgroundModal
		.findAll({
			attributes: ['id', 'title', 'content'],
			where: { novel_id: id }
		});

	// check if output is empty
	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// update a background given novel id
const updateBackground = async (
	id: string | number, props: BackgroundCreateAndUpdateTemplate
): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await BackgroundModal
		.update(
			props,
			{ where: { id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['background'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};

// create a new background
const createBackground = async (
	id: string | number, props: BackgroundCreateAndUpdateTemplate
): Promise<WriteDataModel> => {
	const background: DataModel = await BackgroundModal
		.create({
			...props,
			novel_id: id
		});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['background'],
		success: false
	};
	if (background) {
		result.id = background.dataValues.id;
		result.success = true;
	}

	return result;
};

// delete background
const deleteBackground = async (id: string | number): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await BackgroundModal
		.destroy({
			where: { id }
		});

	return {
		type: 'deleteP',
		tables: ['background'],
		success: dataResult === 1
	};
};

// do update and create at the same time
export const createAndUpdateBackgrounds = async (
	id: string | number, lists: BackgroundTemplate[]
): Promise<WriteDataModel> => {
	const promises: Promise<WriteDataModel>[] = [];
	lists.forEach((background: BackgroundTemplate) => {
		// delete
		if (background.deleted) promises.push(deleteBackground(background.id));
		// create
		else if (background.created) {
			promises.push(
				createBackground(
					id,
					{ title: background.title, content: background.content }
				)
			);
		} else if (background.updated) {
			// update
			promises.push(
				updateBackground(
					background.id,
					{ title: background.title, content: background.content }
				)
			);
		}
	});

	const dataResults: WriteDataModel[] = await Promise.all(promises);
	return {
		type: 'mixed',
		tables: ['background'],
		success: dataResults.every((result: WriteDataModel) => result.success)
	};
};
