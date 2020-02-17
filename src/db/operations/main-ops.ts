import { createAndAddCharacterToOutline, updateCharacter } from './character-ops';
import { deleteTimeline, createTimeline, updateTimeline } from './timeline-ops';
import { deleteCharacterFromOutline, addCharacterToOutline } from './character-outline-ops';
import { createOutlineDetail, updateOutlineDetail } from './detail-ops';

// type declarations
import { MainCharacter, MainTimeline, OutlineContent, ContentCard } from '../../renderer/components/main/mainDec';

export const saveAllChanges = async (
	novel_id: string | number,
	outline_id: string | number,
	deletedCharacters: number[],
	deletedTimelines: number[],
	characters: MainCharacter[],
	timelines: MainTimeline[],
	contents: OutlineContent
): Promise<WriteDataModel> => {
	const promises: Promise<WriteDataModel>[] = [];

	// remove this character from current outline
	deletedCharacters.forEach((id: number) => {
		if (id >= 0) promises.push(deleteCharacterFromOutline(id, outline_id));
	});

	/**
	 * delete all previous timelines
	 * timelines will be permanently deleted by default
	 */
	deletedTimelines.forEach((id: number) => {
		if (id >= 0) promises.push(deleteTimeline(id));
	});

	/**
	 * above sections and below sections are independent
	 * no matter what result it will have, they will not affect each other
	 */

	// save all created/updated characters
	characters.forEach((character: MainCharacter) => {
		// add existing character to character-outline table
		if (character.existing) {
			promises.push(
				addCharacterToOutline(character.id, outline_id)
			);
		} else if (character.created) {
			/**
			 * create that character
			 * then need to add that character to character-outline table
			 */
			promises.push(
				createAndAddCharacterToOutline(
					{
						novel_id,
						name: character.name,
						color: character.color
					},
					outline_id
				)
			);
		} else if (character.updated) {
			// update that character
			promises.push(
				updateCharacter(
					character.id,
					{
						name: character.name,
						color: character.color
					}
				)
			);
		}
	});

	// save all created/updated timelines
	timelines.forEach((timeline: MainTimeline) => {
		// create that timeline
		if (timeline.created) promises.push(createTimeline(outline_id, timeline.time));
		// update that timeline
		else if (timeline.updated) promises.push(updateTimeline(timeline.id, timeline.time));
	});

	/**
   * all changes of timelines and characters are saved
   * but for created timelines and characters,
   * their corresponding ids are incorrect right now (now are negative)
   * so need to get correct id before dealing with content card
   */
	const result: WriteDataModel[] = await Promise.all(promises);
	/**
	 * get all characters that are created, right now we have:
	 *
	 * 1) type = create && tables = character-outline
	 * 2) type = create && tables = [character-outline, character] (we want this)
	 * 3) type = update && tables = character
	 * 4) type = create && tables = timeline
	 * 5) type = update && tables = timeline
	 *
	 * Therefore, need to check for type and tables at the same time
	 */
	const characterIds: number[] = [];
	const timelineIds: number[] = [];
	result.forEach((model: WriteDataModel) => {
		const { type, tables, id } = model;
		if (type === 'create') {
			// separate timeline and character here
			if (tables.includes('timeline') && id) timelineIds.push(id);
			else if (tables.includes('character') && id) characterIds.push(id);
		}
	});

	/**
	 * create id mapping for both characters and timelines
	 * because use Promise.all, the order is fixed, which means
	 * first negative id in this.state.characters => characters[0]
	 */
	const characterMapping = new Map<number, number>();
	const timelineMapping = new Map<number, number>();
	let characterIndex: number = 0;
	let timelineIndex: number = 0;
	// create mapping for character id
	characters.forEach((character: MainCharacter) => {
		if (character.id <= 0) {
			characterMapping.set(character.id, characterIds[characterIndex]);
			characterIndex += 1;
		}
	});
	// create mapping for timeline id
	timelines.forEach((timeline: MainTimeline) => {
		if (timeline.id <= 0) {
			timelineMapping.set(timeline.id, timelineIds[timelineIndex]);
			timelineIndex += 1;
		}
	});

	const promises2: Promise<WriteDataModel>[] = [];
	// save all content cards to database
	contents.forEach((timelineMap: Map<number, ContentCard>, character_id: number) => {
		timelineMap.forEach((content: ContentCard, timeline_id: number) => {
			const contentText: string = content.content;
			const c_id = character_id > 0 ? character_id : (characterMapping.get(character_id) || -1);
			const t_id = timeline_id > 0 ? timeline_id : (timelineMapping.get(timeline_id) || -1);

			// create new content card
			if (content.created) promises2.push(createOutlineDetail(outline_id, c_id, t_id, contentText));
			// update new content card
			else if (content.updated) promises2.push(updateOutlineDetail(content.id, contentText));
		});
	});

	const result2: WriteDataModel[] = await Promise.all(promises2);

	return {
		type: 'mixed',
		tables: ['outline-detail', 'character', 'timeline'],
		success: result2.every((result: WriteDataModel) => result.success)
	};
};
