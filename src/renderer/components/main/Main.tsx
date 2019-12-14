import * as React from 'react';
import { Col, message as Message, Icon } from 'antd';
import classnames from 'classnames';

// custom components
import MainHeader from '../main-header/MainHeader';
import Toolbar from '../toolbar/Toolbar';
import CharacterCard from './character-card/CharacterCard';
import TimelineCard from './timeline-card/TimelineCard';
import DetailCard from './content-card/ContentCard';

// enable history and page leave warning
import { withRouter } from 'react-router-dom';

// type declaration
import { OutlineDataValue } from '../sidebar/sidebarDec';
import {
	MainProps, MainState, CharacterDataValue, Character,
	TimelineDataValue, Timeline, OutlineDetailDataValue, ContentCard
} from './mainDec';
import { DatabaseError } from 'sequelize';

// database operations
import { updateScaling, getOutline as getOutlineOp } from '../../../db/operations/outline-ops';
import {
	getAllCharacters, createCharacter,
	updateCharacter, deleteCharacter
} from '../../../db/operations/character-ops';
import {
	getAllTimelines, createTimeline,
	updateTimeline, deleteTimeline
} from '../../../db/operations/timeline-ops';
import { getAllOutlineDetails, createOutlineDetail, updateOutlineDetail } from '../../../db/operations/detail-ops';

// utils
import { colors } from '../../utils/constants';
import { onTextAreaResize, filterUpdateById, ctrlsPress, filterSaveResult } from '../../utils/utils';

// sass
import './main.scss';

class Main extends React.Component<MainProps, MainState> {
	// reference to the main-content
	private mainRef = React.createRef<HTMLDivElement>();

	constructor(props: MainProps) {
		super(props);
		this.state = {
			colors,
			id: -1,
			title: '标题',
			description: '描述...',
			characters: [],
			timelines: [],
			changed: false,
			contents: new Map<number, Map<number, ContentCard>>(),
			shouldScroll: true,
			scaling: '1',
			showPlusIcons: true,
			deletedCharacters: [],
			deletedTimelines: []
		};
	}

	componentWillReceiveProps = async (props: MainProps) => {
		// save changed before
		// (this.onSave(true) || Promise.resolve()).then(() => {
		// 	const { id } = props.match.params;
		// 	this.onInit(id);
		// });
		const { id } = props.match.params;
		this.onInit(id);
	}

	componentDidMount = () => {
		// add event listener for control + s event
		document.addEventListener('keydown', this.onSavePress);

		const { id } = this.props.match.params;
		this.onInit(id);
	}

	// scroll to top left when first enters the page
	componentDidUpdate = () => {
		if (this.state.shouldScroll) (this.mainRef.current as HTMLDivElement).scrollTo(0, 0);
	}

	// save unsaved contents after leaving the page
	componentWillUnmount = () => {
		// remove event listener for control + s event
		document.removeEventListener('keydown', this.onSavePress);

		if (this.state.changed) this.onSave(true);
	}

	// on init
	onInit = (id: string) => {
		// get outline's id, title and description
		this.getOutline(id);
		// get characters
		this.getCharacters(id);
		// get all timelines
		this.getTimelines(id);
		// get all outline details
		this.getContents(id);
	}

	// if character's name is changed
	onCharacterNameChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		this.setState((prevState: MainState) => ({
			...prevState,
			characters: filterUpdateById(prevState.characters, id, value, false),
			changed: true,
			shouldScroll: false
		}));
	}

	// if timeline's time is changed
	onTimelineChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		this.setState((prevState: MainState) => ({
			...prevState,
			timelines: filterUpdateById(prevState.timelines, id, value, true),
			changed: true,
			shouldScroll: false
		}));
	}

	// if content card is changed
	onContentChange = (character_id: number, timeline_id: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value: string = e.target.value;
		const { contents } = this.state;
		const card: ContentCard = ((contents.get(character_id) || new Map()).get(timeline_id) || {});
		const newCard: ContentCard = { ...card, content: value, updated: true };
		(contents.get(character_id) || new Map()).set(timeline_id, newCard);
		this.setState({ contents, changed: true, shouldScroll: false });
	}

	// on save press
	onSavePress = (e: KeyboardEvent) => {
		ctrlsPress(e, this.onSave);
	}

	// save all changes
	onSave = (notUpdateState: boolean): Promise<any> | void => {
		// if there is no change, directly return
		if (!this.state.changed) return;

		const { id } = this.props.match.params;
		const promises: Promise<any>[] = [];

		// delete all previous characters
		this.state.deletedCharacters.forEach((id: number) => {
			if (id >= 0) promises.push(deleteCharacter(id));
		});

		// delete all previous timelines
		this.state.deletedTimelines.forEach((id: number) => {
			if (id >= 0) promises.push(deleteTimeline(id));
		});

		// save all created/updated characters
		this.state.characters.forEach((character: Character) => {
			// create that character
			if (character.created) promises.push(createCharacter(id, character.name, character.color));
			// update that character
			else if (character.updated) promises.push(updateCharacter(character.id, character.name, character.color));
		});

		// save all created/updated timelines
		this.state.timelines.forEach((timeline: Timeline) => {
			// create that timeline
			if (timeline.created) promises.push(createTimeline(id, timeline.time));
			// update that timeline
			else if (timeline.updated) promises.push(updateTimeline(timeline.id, timeline.time));
		});

		/**
		 * all changes of timelines and characters are saved
		 * but for created timelines and characters
		 * their corresponding ids are incorrect right now
		 * so need to get correct id before dealing with content card
		 */
		return Promise
			.all(promises)
			.then((result: any) => {
				/**
				 * filter all records that are created
				 * for update operation, the record is an array, otherwise object
				 */
				const created = filterSaveResult(result);
				/**
				 * filter character or timeline based on property
				 * character has 'name' and timeline has 'time'
				 * and separate them
				 */
				const characters: number[] = [];
				const timelines: number[] = [];
				created.forEach((
					{ dataValues, 'null': id }:
						{ dataValues: CharacterDataValue & TimelineDataValue, 'null': number }
				) => {
					if (dataValues.name) characters.push(id);
					else if (dataValues.time) timelines.push(id);
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
				this.state.characters.forEach((character: Character) => {
					if (character.id <= 0) {
						characterMapping.set(character.id, characters[characterIndex]);
						characterIndex += 1;
					}
				});
				// create mapping for timeline id
				this.state.timelines.forEach((timeline: Timeline) => {
					if (timeline.id <= 0) {
						timelineMapping.set(timeline.id, timelines[timelineIndex]);
						timelineIndex += 1;
					}
				});

				const promises: Promise<any>[] = [];
				// save all content cards to database
				this.state.contents.forEach((timelineMap: Map<number, ContentCard>, character_id: number) => {
					timelineMap.forEach((content: ContentCard, timeline_id: number) => {
						const contentText: string = content.content;
						const c_id = character_id > 0 ? character_id : (characterMapping.get(character_id) || -1);
						const t_id = timeline_id > 0 ? timeline_id : (timelineMapping.get(timeline_id) || -1);

						// create new content card
						if (content.created) promises.push(createOutlineDetail(id, c_id, t_id, contentText));
						// update new content card
						else if (content.updated) promises.push(updateOutlineDetail(content.id, contentText));
					});
				});
				return Promise.all(promises);
			})
			.then(() => {
				// alert success
				Message.success('保存成功！');
				// set changed to false and refresh main page
				if (!notUpdateState) this.setState({ changed: false }, () => { this.props.refreshMain(); });
				else this.props.refreshMain();
				return Promise.resolve();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
				// set changed to false and refresh main page
				if (!notUpdateState) this.setState({ changed: false }, () => { this.props.refreshMain(); });
				else this.props.refreshMain();
			});
	}

	// set scaling of page
	onChangeScaling = (scaling: string) => {
		const { id } = this.props.match.params;
		// insert scaling to database
		updateScaling(id, scaling)
			.then(() => {
				this.setState({ scaling });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// hide all the plus icons
	onTogglePlus = (checked: boolean) => {
		this.setState({ showPlusIcons: checked });
	}

	// create character locally (not publish to database yet)
	createCharacterLocally = (name: string) => {
		const colorIndex = this.state.characters.length % this.state.colors.length;
		// create a local character
		const newCharacter: Character = {
			name,
			color: this.state.colors[colorIndex],
			id: -this.state.characters.length,
			created: true
		};

		// add local character to all characters
		this.setState((prevState: MainState) => ({
			...prevState,
			characters: prevState.characters.concat(newCharacter),
			changed: true,
			shouldScroll: false
		}));
	}

	// delete character locally (not publish to database yet)
	deleteCharacterLocally = (id: number) => {
		// remove character from contents
		const contents = this.state.contents;
		contents.delete(id);
		// delete all contents about this character
		this.setState((prevState: MainState) => ({
			...prevState,
			contents,
			characters: prevState.characters.filter((character: Character) => character.id !== id),
			deletedCharacters: prevState.deletedCharacters.concat(id),
			changed: true,
			shouldScroll: false
		}));
	}

	// delete timeline locally (not publish to database yet)
	deleteTimelineLocally = (id: number) => {
		// remove timeline from contents
		const contents = this.state.contents;
		contents.forEach((timelineMap: Map<number, ContentCard>) => {
			timelineMap.delete(id);
		});

		// delete all contents about this character
		this.setState((prevState: MainState) => ({
			...prevState,
			contents,
			timelines: prevState.timelines.filter((timeline: Timeline) => timeline.id !== id),
			deletedTimelines: prevState.deletedTimelines.concat(id),
			changed: true,
			shouldScroll: false
		}));
	}

	// create timeline locally (not publish to database yet)
	createTimelineLocally = (time: string) => {
		// create a local timeline
		const newTimeline: Timeline = {
			time,
			id: -this.state.timelines.length,
			created: true
		};

		// add local timeline to all timelines
		this.setState((prevState: MainState) => ({
			...prevState,
			timelines: prevState.timelines.concat(newTimeline),
			changed: true,
			shouldScroll: false
		}));
	}

	// create textarea for specific content card
	createTextAreaLocally = (character_id: number, timeline_id: number) => {
		const { contents } = this.state;
		const card: ContentCard = { content: '', created: true };

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

		// update contents
		this.setState((prevState: MainState) => ({
			...prevState,
			contents,
			changed: true,
			shouldScroll: false
		}));
	}

	// set color of a character locally
	setColorLocally = (id: number, color: string) => {
		this.setState((prevState: MainState) => ({
			...prevState,
			characters: prevState.characters.map((character: Character) => {
				if (character.id === id) {
					character.color = color;
					character.updated = true;
				}
				return character;
			}),
			changed: true,
			shouldScroll: false
		}));
	}

	// get outline intro
	getOutline = (id: string) => {
		getOutlineOp(id)
			.then(({ dataValues }: { dataValues: OutlineDataValue }) => {
				const { id, title, description, scaling } = dataValues;
				this.setState({
					id,
					title,
					description,
					scaling
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all timelines
	getTimelines = (id: string) => {
		// get all timelines
		getAllTimelines(id)
			.then((result: any) => {
				// grab all timelines
				const timelines: Timeline[] = result.map(({ dataValues }: { dataValues: TimelineDataValue }) => {
					return { id: dataValues.id, time: dataValues.time };
				});
				// set timelines
				this.setState({ timelines });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all characters
	getCharacters = (id: string) => {
		getAllCharacters(id)
			.then((result: any) => {
				// get all characters
				const characters: Character[] = result.map(({ dataValues }: { dataValues: CharacterDataValue }) => {
					return { id: dataValues.id, name: dataValues.name, color: dataValues.color };
				});
				// set characters
				this.setState({ characters });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all content cards
	getContents = (id: string) => {
		getAllOutlineDetails(id)
			.then((result: any) => {
				const { contents } = this.state;
				result.forEach(({ dataValues }: { dataValues: OutlineDetailDataValue }) => {
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

				// update contents
				this.setState((prevState: MainState) => ({
					...prevState,
					contents,
					shouldScroll: true
				}));
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand, refreshSidebar, refreshMain } = this.props;
		const {
			title, description, characters, timelines,
			contents, scaling, showPlusIcons
		} = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('main', {
						'main-grow': !expand
					})
				}
			>
				<MainHeader
					title={title}
					description={description}
					refresh={refreshSidebar}
					refreshMain={refreshMain}
					createCharacterLocally={this.createCharacterLocally}
					createTimelineLocally={this.createTimelineLocally}
					onSave={this.onSave}
				/>
				<Toolbar
					scaling={scaling}
					onChangeScaling={this.onChangeScaling}
					onTogglePlus={this.onTogglePlus}
				/>
				<div className="main-content" ref={this.mainRef}>
					<table style={{ zoom: scaling }}>
						<thead>
							<tr>
								<th className="timeline-header character-append" />
								{
									characters.map((character: Character) => (
										<CharacterCard
											key={character.id}
											id={character.id}
											name={character.name}
											onCharacterNameChange={this.onCharacterNameChange}
											deleteCharacterLocally={this.deleteCharacterLocally}
											setColorLocally={this.setColorLocally}
											color={character.color}
										/>
									))
								}
							</tr>
						</thead>
						<tbody>
							{
								timelines.map((timeline: Timeline, index: number) => (
									<tr key={timeline.id}>
										<TimelineCard
											id={timeline.id}
											time={timeline.time}
											isFirst={index === 0}
											onTimelineChange={this.onTimelineChange}
											deleteTimelineLocally={this.deleteTimelineLocally}
										/>
										{
											characters.map((character: Character) => (
												<DetailCard
													key={character.id}
													color={character.color}
													character_id={character.id}
													timeline_id={timeline.id}
													contents={contents}
													isFirst={index === 0}
													isLast={index === timelines.length - 1}
													showPlusIcons={showPlusIcons}
													onTextareaResize={onTextAreaResize}
													onContentChange={this.onContentChange}
													createTextAreaLocally={this.createTextAreaLocally}
												/>
											))
										}
									</tr>
								))
							}
						</tbody>
					</table>
				</div>
			</Col>
		);
	}
}

export default withRouter(Main);
