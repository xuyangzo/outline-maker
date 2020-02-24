import * as React from 'react';
import { Col, message as Message } from 'antd';
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
import {
	MainProps, MainState, MainCharacter, MainCharacterDataValue, OutlineDataValue,
	TimelineDataValue, MainTimeline, ContentCard, OutlineContent
} from './mainDec';

// database operations
import { updateOutline, getOutline as getOutlineOp } from '../../../db/operations/outline-ops';
import { getCharacterSimple, getAllCharactersGivenOutline } from '../../../db/operations/character-ops';
import { getAllTimelines } from '../../../db/operations/timeline-ops';
import { getAllOutlineDetails } from '../../../db/operations/detail-ops';
import { saveAllChanges } from '../../../db/operations/main-ops';

// utils
import { colors } from '../../utils/constants';
import { onTextAreaResize, filterUpdateById, ctrlsPress } from '../../utils/utils';

// sass
import './main.scss';

// image
import empty from '../../../public/empty-outline.png';

class Main extends React.Component<MainProps, MainState> {
	// reference to the main-content
	private mainRef = React.createRef<HTMLDivElement>();

	constructor(props: MainProps) {
		super(props);
		this.state = {
			colors,
			id: props.match.params.id,
			title: '标题',
			description: '描述...',
			characters: [],
			timelines: [],
			changed: false,
			contents: new Map<number, Map<number, ContentCard>>(),
			shouldScroll: true,
			shouldRender: false,
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
		this.setState({ id: props.match.params.id });
		this.onInit(props.match.params.id);
	}

	componentDidMount = () => {
		// add event listener for control + s event
		document.addEventListener('keydown', this.onSavePress);

		this.onInit(this.props.match.params.id);
	}

	// scroll to top left when first enters the page
	componentDidUpdate = () => {
		if (this.state.shouldScroll) (this.mainRef.current as HTMLDivElement).scrollTo(0, 0);
	}

	// save unsaved contents after leaving the page
	componentWillUnmount = () => {
		// remove event listener for control + s event
		document.removeEventListener('keydown', this.onSavePress);

		// if (this.state.changed) this.onSave(true);
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

		const { novel_id, id } = this.props.match.params;
		const { deletedCharacters, deletedTimelines, characters, timelines, contents } = this.state;

		// save all changes
		saveAllChanges(
			novel_id, id, deletedCharacters, deletedTimelines,
			characters, timelines, contents
		)
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
		updateOutline(this.state.id, { scaling })
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
		const newCharacter: MainCharacter = {
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

	// import existing character locally
	importCharacterLocally = (id: string) => {
		// get that character's information
		getCharacterSimple(id)
			.then((character: MainCharacterDataValue) => {
				const { name, color, id } = character;
				const colorIndex = this.state.characters.length % this.state.colors.length;

				const newCharacter: MainCharacter = {
					name,
					color: color ? color : this.state.colors[colorIndex],
					id: typeof id === 'string' ? parseInt(id, 10) : id,
					outline_id: this.state.id,
					existing: true
				};
				this.setState((prevState: MainState) => ({
					...prevState,
					characters: prevState.characters.concat(newCharacter),
					changed: true,
					shouldScroll: false
				}));
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
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
			characters: prevState.characters.filter((character: MainCharacter) => character.id !== id),
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
			timelines: prevState.timelines.filter((timeline: MainTimeline) => timeline.id !== id),
			deletedTimelines: prevState.deletedTimelines.concat(id),
			changed: true,
			shouldScroll: false
		}));
	}

	// create timeline locally (not publish to database yet)
	createTimelineLocally = (time: string) => {
		// create a local timeline
		const newTimeline: MainTimeline = {
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
		this.setState({
			contents,
			changed: true,
			shouldScroll: false
		});
	}

	// set color of a character locally
	setColorLocally = (id: number, color: string) => {
		this.setState((prevState: MainState) => ({
			...prevState,
			characters: prevState.characters.map((character: MainCharacter) => {
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
			.then((outline: OutlineDataValue) => {
				const { id, title, description, scaling } = outline;
				this.setState({ title, description, scaling, id: id.toString() });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all timelines
	getTimelines = (id: string) => {
		// get all timelines
		getAllTimelines(id)
			.then((timelines: TimelineDataValue[]) => {
				this.setState({ timelines });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all characters
	getCharacters = (id: string) => {
		getAllCharactersGivenOutline(id)
			.then((characters: MainCharacterDataValue[]) => {
				this.setState({ characters });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all content cards
	getContents = (id: string) => {
		getAllOutlineDetails(id, this.state.contents)
			.then((contents: OutlineContent) => {
				this.setState({
					contents,
					shouldScroll: true,
					shouldRender: true
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand, refreshSidebar, refreshMain } = this.props;
		const {
			title, description, characters, timelines,
			contents, scaling, showPlusIcons, shouldRender
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
					importCharacterLocally={this.importCharacterLocally}
					createTimelineLocally={this.createTimelineLocally}
					onSave={this.onSave}
				/>
				<Toolbar
					scaling={scaling}
					onChangeScaling={this.onChangeScaling}
					onTogglePlus={this.onTogglePlus}
				/>
				<div className="main-content" ref={this.mainRef}>
					{
						shouldRender && !characters.length && !timelines.length && (
							<div className="empty-outline-page">
								<h2>暂时还没有内容...</h2>
								<img src={empty} alt="暂时还没有内容..." />
							</div>
						)
					}
					<table style={{ zoom: scaling }}>
						<thead>
							<tr>
								<th className="timeline-header character-append" />
								{
									characters.map((character: MainCharacter) => (
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
								timelines.map((timeline: MainTimeline, index: number) => (
									<tr key={timeline.id}>
										<TimelineCard
											id={timeline.id}
											time={timeline.time}
											isFirst={index === 0}
											onTimelineChange={this.onTimelineChange}
											deleteTimelineLocally={this.deleteTimelineLocally}
										/>
										{
											characters.map((character: MainCharacter) => (
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
