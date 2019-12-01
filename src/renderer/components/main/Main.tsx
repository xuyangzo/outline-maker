import * as React from 'react';
import { Col, message as Message, Icon } from 'antd';
import classnames from 'classnames';

// custom components
import MainHeader from '../main-header/MainHeader';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { OutlineDataValue } from '../sidebar/sidebarDec';
import {
	MainProps,
	MainState,
	CharacterDataValue,
	Character,
	TimelineDataValue,
	Timeline,
	OutlineDetailDataValue,
	ContentCard
} from './mainDec';
import { DatabaseError, ValidationErrorItem } from 'sequelize';

// sequelize modals
import Outlines from '../../../db/models/Outlines';
import CharacterModal from '../../../db/models/Character';
import TimelineModal from '../../../db/models/Timeline';
import OutlineDetails from '../../../db/models/OutlineDetails';

// sass
import './main.scss';

class Main extends React.Component<MainProps, MainState> {
	private mainRef = React.createRef<HTMLDivElement>();

	constructor(props: MainProps) {
		super(props);
		this.state = {
			id: -1,
			title: '标题',
			description: '描述...',
			characters: [],
			timelines: [],
			changed: false,
			contents: new Map<number, Map<number, ContentCard>>(),
			shouldScroll: true
		};
	}

	componentWillReceiveProps = (props: MainProps) => {
		const { id } = props.match.params;
		// get outline's id, title and description
		this.getOutline(id);
		// get characters
		this.getCharacters(id);
		// get all timelines
		this.getTimelines(id);
		// get all outline details
		this.getContents(id);
	}

	componentDidMount = () => {
		// add event listener
		document.addEventListener('keydown', this.keyPress);

		const { id } = this.props.match.params;
		// get outline's id, title and description
		this.getOutline(id);
		// get characters
		this.getCharacters(id);
		// get all timelines
		this.getTimelines(id);
		// get all outline details
		this.getContents(id);
	}

	// scroll to top left when first enters the page
	componentDidUpdate = () => {
		if (this.state.shouldScroll) {
			(this.mainRef.current as HTMLDivElement).scrollTo(0, 0);
		}
	}

	// if character's name is changed
	onCharacterNameChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		// update state
		this.setState((prevState: MainState) => ({
			...prevState,
			characters: prevState.characters.map((character: Character) => {
				if (character.id === id) {
					character.name = value;
					character.updated = true;
					return character;
				}
				return character;
			}),
			changed: true,
			shouldScroll: false
		}));
	}

	// if timeline is changed
	onTimelineChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		// update state
		this.setState((prevState: MainState) => ({
			...prevState,
			timelines: prevState.timelines.map((timeline: Timeline) => {
				if (timeline.id === id) {
					timeline.time = value;
					timeline.updated = true;
					return timeline;
				}
				return timeline;
			}),
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
		this.setState((prevState: MainState) => ({
			...prevState,
			contents,
			changed: true,
			shouldScroll: false
		}));
	}

	// save all changes
	onSave = () => {
		// if there is no change, do not save
		if (!this.state.changed) return;

		const { id } = this.props.match.params;
		const promises: Promise<any>[] = [];
		// save all created/updated characters
		this.state.characters.forEach((character: Character) => {
			if (character.created) {
				// create that character
				promises.push(
					CharacterModal
						.create({
							outline_id: id,
							name: character.name
						})
				);
			} else if (character.updated) {
				// update that character
				promises.push(
					CharacterModal
						.update(
							{ name: character.name },
							{ where: { id: character.id } }
						)
				);
			}
		});

		// save all created/updated timelines
		this.state.timelines.forEach((timeline: Timeline) => {
			if (timeline.created) {
				// create that timeline
				promises.push(
					TimelineModal
						.create({
							outline_id: id,
							time: timeline.time
						})
				);
			} else if (timeline.updated) {
				// update that timeline
				promises.push(
					TimelineModal
						.update(
							{ time: timeline.time },
							{ where: { id: timeline.id } }
						)
				);
			}
		});

		/**
		 * all changes of timelines and characters are saved
		 * but for created timelines and characters
		 * their corresponding ids are incorrect right now
		 * so need to get correct id before dealing with content card
		 */
		Promise
			.all(promises)
			.then((result: any) => {
				/**
				 * filter all records that are created
				 * for update operation, the record is an array, otherwise object
				 */
				const created = result.filter((r: any) => !Array.isArray(r));
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
					if (character.id < 0) {
						characterMapping.set(character.id, characters[characterIndex]);
						characterIndex += 1;
					}
				});
				// create mapping for timeline id
				this.state.timelines.forEach((timeline: Timeline) => {
					if (timeline.id < 0) {
						timelineMapping.set(timeline.id, timelines[timelineIndex]);
						timelineIndex += 1;
					}
				});

				const promises: Promise<any>[] = [];
				// save all content cards to database
				this.state.contents.forEach((timelineMap: Map<number, ContentCard>, character_id: number) => {
					timelineMap.forEach((content: ContentCard, timeline_id: number) => {
						const contentText: string = content.content;
						const c_id = character_id > 0 ? character_id : characterMapping.get(character_id);
						const t_id = timeline_id > 0 ? timeline_id : timelineMapping.get(timeline_id);

						// create new content card
						if (content.created) {
							promises.push(
								OutlineDetails
									.create({
										outline_id: id,
										character_id: c_id,
										timeline_id: t_id,
										content: contentText
									})
							);
						} else if (content.updated) {
							console.log(contentText);
							// update new content card
							promises.push(
								OutlineDetails
									.update(
										{ content: contentText },
										{ where: { id: content.id } }
									)
							);
						}
					});
				});
				return Promise.all(promises);
			})
			.then(() => {
				// alert success
				Message.success('保存成功！');
				// set changed to false
				this.setState(
					{
						changed: false
					},
					() => {
						// refresh main page
						this.props.refreshMain();
					}
				);
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// textarea height auto grow
	onTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		/**
		 * scrollHeight is restricted by height
		 * therefore need to set height to 1 first
		 */
		e.target.style.height = '1px';
		e.target.style.height = `${e.target.scrollHeight}px`;
	}

	// create character locally (not publish to database yet)
	createCharacterLocally = (name: string) => {
		// create a local character
		const newCharacter: Character = {
			name,
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

	// when control + s is pressed
	keyPress = (e: KeyboardEvent) => {
		const controlPress = e.ctrlKey || e.metaKey;
		const sPress = String.fromCharCode(e.which).toLowerCase() === 's';
		if (controlPress && sPress) {
			this.onSave();
		}
	}

	// get outline intro
	getOutline = (id: string) => {
		Outlines
			.findOne({
				where: {
					id
				}
			})
			.then(({ dataValues }: { dataValues: OutlineDataValue }) => {
				const { id, title, description } = dataValues;
				this.setState({
					id,
					title,
					description
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all timelines
	getTimelines = (id: string) => {
		// get all timelines
		TimelineModal
			.findAll({
				where: {
					outline_id: id
				}
			})
			.then((result: any) => {
				// grab all timelines
				const timelines: Timeline[] = result.map(({ dataValues }: { dataValues: TimelineDataValue }) => {
					const { id, time } = dataValues;
					return { id, time };
				});

				// set timelines
				this.setState((prevState: MainState) => ({
					...prevState,
					timelines
				}));
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all characters
	getCharacters = (id: string) => {
		CharacterModal
			.findAll({
				where: {
					outline_id: id
				}
			})
			.then((result: any) => {
				// get all characters
				const characters: Character[] = result.map(({ dataValues }: { dataValues: CharacterDataValue }) => {
					const { id, name } = dataValues;
					return { id, name };
				});

				// set characters
				this.setState((prevState: MainState) => ({
					...prevState,
					characters
				}));
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all content cards
	getContents = (id: string) => {
		OutlineDetails
			.findAll({
				where: {
					outline_id: id
				}
			})
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
		const { title, description, characters, timelines, contents } = this.state;

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
				<div className="main-content" ref={this.mainRef}>
					<table>
						<thead>
							<tr>
								<th className="timeline-header character-append" />
								{
									characters.map((character: Character, index: number) => (
										<th key={character.id} className="character-header">
											<div className="main-character-card">
												<input
													type="text"
													value={character.name}
													onChange={
														(e: React.ChangeEvent<HTMLInputElement>) => this.onCharacterNameChange(character.id, e)
													}
												/>
											</div>
										</th>
									))
								}
							</tr>
						</thead>
						<tbody>
							{
								timelines.map((timeline: Timeline) => (
									<tr key={timeline.id}>
										<td className="timeline-header">
											<div className="timeline-component-after">
												<input
													type="text"
													value={timeline.time}
													onChange={
														(e: React.ChangeEvent<HTMLInputElement>) => this.onTimelineChange(timeline.id, e)
													}
												/>
											</div>
										</td>
										{
											characters.map((character: Character, index: number) => (
												<td
													key={character.id}
												>
													<div className="main-content-card">
														{
															(contents.get(character.id) || new Map()).get(timeline.id) ?
																(
																	<textarea
																		wrap="hard"
																		onFocus={this.onTextareaResize}
																		onInput={this.onTextareaResize}
																		onChange={
																			(e: React.ChangeEvent<HTMLTextAreaElement>) => this.onContentChange(character.id, timeline.id, e)
																		}
																		value={(contents.get(character.id) || new Map()).get(timeline.id).content}
																		autoFocus
																	/>
																) :
																(
																	<Icon
																		type="plus-circle"
																		className="plus-icon"
																		onClick={() => this.createTextAreaLocally(character.id, timeline.id)}
																	/>
																)
														}
													</div>
												</td>
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
