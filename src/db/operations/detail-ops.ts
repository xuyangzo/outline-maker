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
export const createOutlineDetail = (
	id: string, c_id: number, t_id: number, contentText: string
): Promise<DataUpdateResult> => {
	return OutlineDetails
		.create({
			outline_id: id,
			character_id: c_id,
			timeline_id: t_id,
			content: contentText
		});
};

// update outline detail
export const updateOutlineDetail = (
	id: string | number | undefined, contentText: string
): Promise<DataUpdateResult> => {
	return OutlineDetails
		.update(
			{ content: contentText },
			{ where: { id } }
		);
};

// delete all outline details related to a outline
export const deleteOutlineDetailsGivenOutline = (outline_id: number | string): Promise<DataUpdateResult> => {
	return OutlineDetails
		.destroy({
			where: {
				outline_id
			}
		});
};

// delete all outline details related to a character
export const deleteOutlineDetailsGivenChar = (character_id: number | string): Promise<DataUpdateResult> => {
	return OutlineDetails
		.destroy({
			where: {
				character_id
			}
		});
};

// delete all outline details related to a timeline
export const deleteOutlineDetailsGivenTime = (timeline_id: number | string): Promise<DataUpdateResult> => {
	return OutlineDetails
		.destroy({
			where: {
				timeline_id
			}
		});
};
