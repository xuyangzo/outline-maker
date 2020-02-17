import OutlineDetails from '../models/OutlineDetails';

// type declaration
import { OutlineContent, OutlineDetailDataValue, ContentCard } from '../../renderer/components/main/mainDec';

// get all outline details given outline id
export const getAllOutlineDetails = async (id: string, contents: OutlineContent): Promise<OutlineContent> => {
	const dataResults: DataResults = await OutlineDetails
		.findAll({
			attributes: ['id', 'character_id', 'timeline_id', 'content'],
			where: {
				outline_id: id
			}
		});

	if (dataResults && dataResults.length) {
		dataResults.forEach(({ dataValues }: { dataValues: OutlineDetailDataValue }) => {
			const { id, character_id, timeline_id, content } = dataValues;
			const card: ContentCard = { id, content };

			/**
			 * if current map does not have corresponding character_id
			 * create a new map for <timeline_id, content>
			 * and insert it into contents
			 */
			if (!contents.has(character_id)) {
				const timelineMap = new Map<number, ContentCard>([[timeline_id, card]]);
				contents.set(character_id, timelineMap);
			} else {
				/**
				 * otherwise, add content to existing timelineMap
				 */
				const timelineMap: Map<number, ContentCard> = contents.get(character_id) || new Map();
				timelineMap.set(timeline_id, card);
			}
		});
	}

	return contents;
};

// create new outline detail
export const createOutlineDetail = async (
	id: string | number, c_id: string | number, t_id: string | number, contentText: string
): Promise<WriteDataModel> => {
	const outline: DataModel = await OutlineDetails
		.create({
			outline_id: id,
			character_id: c_id,
			timeline_id: t_id,
			content: contentText
		});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['outline-detail'],
		success: false
	};
	if (outline) {
		result.id = outline.dataValues.id;
		result.success = true;
	}

	return result;
};

// update outline detail
export const updateOutlineDetail = async (
	id: string | number | undefined, contentText: string
): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await OutlineDetails
		.update(
			{ content: contentText },
			{ where: { id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['outline-detail'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};
