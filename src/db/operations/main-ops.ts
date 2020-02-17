// import { createAndAddCharacterToOutline, updateCharacter } from './character-ops';
// import { deleteTimeline, createTimeline, updateTimeline } from './timeline-ops';
// import { deleteCharacterFromOutline, addCharacterToOutline } from './character-outline-ops';
// import { filterSaveResult } from '../../renderer/utils/utils';

// // type declarations
// import { MainCharacter, MainTimeline } from '../../renderer/components/main/mainDec';

// export const saveAllChanges = async (
// 	novel_id: string | number,
// 	outline_id: string | number,
// 	deletedCharacters: number[],
// 	deletedTimelines: number[],
// 	characters: MainCharacter[],
// 	timelines: MainTimeline[]
// ) => {
// 	const promises: Promise<any>[] = [];

// 	// remove this character from current outline
// 	deletedCharacters.forEach((id: number) => {
// 		if (id >= 0) promises.push(deleteCharacterFromOutline(id, outline_id));
// 	});

// 	/**
// 	 * delete all previous timelines
// 	 * timelines will be permanently deleted by default
// 	 */
// 	deletedTimelines.forEach((id: number) => {
// 		if (id >= 0) promises.push(deleteTimeline(id));
// 	});

// 	/**
// 	 * above sections and below sections are independent
// 	 * no matter what result it will have, they will not affect each other
// 	 */

// 	// save all created/updated characters
// 	characters.forEach((character: MainCharacter) => {
// 		// add existing character to character-outline table
// 		if (character.existing) {
// 			promises.push(
// 				addCharacterToOutline(character.id, outline_id)
// 			);
// 		} else if (character.created) {
// 			/**
// 			 * create that character
// 			 * then need to add that character to character-outline table
// 			 */
// 			promises.push(
// 				createAndAddCharacterToOutline(
// 					{
// 						novel_id,
// 						name: character.name,
// 						color: character.color
// 					},
// 					outline_id
// 				)
// 			);
// 		} else if (character.updated) {
// 			// update that character
// 			const props: any = {
// 				name: character.name,
// 				color: character.color
// 			};
// 			// update outline_id if the character is imported
// 			if (character.outline_id) props.outline_id = character.outline_id;
// 			promises.push(updateCharacter(character.id, props));
// 		}
// 	});

// 	// save all created/updated timelines
// 	timelines.forEach((timeline: MainTimeline) => {
// 		// create that timeline
// 		if (timeline.created) promises.push(createTimeline(outline_id, timeline.time));
// 		// update that timeline
// 		else if (timeline.updated) promises.push(updateTimeline(timeline.id, timeline.time));
// 	});

// 	/**
//    * all changes of timelines and characters are saved
//    * but for created timelines and characters
//    * their corresponding ids are incorrect right now (now are negative)
//    * so need to get correct id before dealing with content card
//    */
// 	return Promise
// 		.all(promises)
// 		.then((result: any) => {
// 			/**
//        * filter all records that are created
//        * for update operation, the record is an array, otherwise object
//        */
// 			const created = filterSaveResult(result);
// 			/**
//        * filter character or timeline based on property
//        * character has 'name' and timeline has 'time'
//        * and separate them
//        */
// 			const characters: number[] = [];
// 			const timelines: number[] = [];
// 			created.forEach(({ dataValues }: { dataValues: CharacterDataValue & TimelineDataValue }) => {
// 				if (dataValues.name) characters.push(dataValues.id);
// 				else if (dataValues.time) timelines.push(dataValues.id);
// 			});

//       /**
//        * create id mapping for both characters and timelines
//        * because use Promise.all, the order is fixed, which means
//        * first negative id in this.state.characters => characters[0]
//        */
// 			const characterMapping = new Map<number, number>();
// 			const timelineMapping = new Map<number, number>();
// 			let characterIndex: number = 0;
// 			let timelineIndex: number = 0;
// 			// create mapping for character id
// 			this.state.characters.forEach((character: MainCharacter) => {
// 				if (character.id <= 0) {
// 					characterMapping.set(character.id, characters[characterIndex]);
// 					characterIndex += 1;
// 				}
// 			});
// 			// create mapping for timeline id
// 			this.state.timelines.forEach((timeline: MainTimeline) => {
// 				if (timeline.id <= 0) {
// 					timelineMapping.set(timeline.id, timelines[timelineIndex]);
// 					timelineIndex += 1;
// 				}
// 			});

// 			const promises: Promise<any>[] = [];
// 			// save all content cards to database
// 			this.state.contents.forEach((timelineMap: Map<number, ContentCard>, character_id: number) => {
// 				timelineMap.forEach((content: ContentCard, timeline_id: number) => {
// 					const contentText: string = content.content;
// 					const c_id = character_id > 0 ? character_id : (characterMapping.get(character_id) || -1);
// 					const t_id = timeline_id > 0 ? timeline_id : (timelineMapping.get(timeline_id) || -1);

// 					// create new content card
// 					if (content.created) promises.push(createOutlineDetail(id, c_id, t_id, contentText));
// 					// update new content card
// 					else if (content.updated) promises.push(updateOutlineDetail(content.id, contentText));
// 				});
// 			});
// 			return Promise.all(promises);
// 		})
// 		.then(() => {
// 			// alert success
// 			Message.success('保存成功！');
// 			// set changed to false and refresh main page
// 			if (!notUpdateState) this.setState({ changed: false }, () => { this.props.refreshMain(); });
// 			else this.props.refreshMain();
// 			return Promise.resolve();
// 		})
// 		.catch((err: DatabaseError) => {
// 			Message.error(err.message);
// 			// set changed to false and refresh main page
// 			if (!notUpdateState) this.setState({ changed: false }, () => { this.props.refreshMain(); });
// 			else this.props.refreshMain();
// 		});
// }
