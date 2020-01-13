import * as React from 'react';
import { Col, message as Message, Collapse } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import NovelHeader from '../novel-header/NovelHeader';
import IntroSection from './intro-section/IntroSection';
import BackgroundSection from './background-section/BackgroundSection';
import CharacterSection from './character-section/CharacterSection';
import LocationSection from './location-section/LocationSection';
import OutlineSection from './outline-section/OutlineSection';

// type declaration
import { NovelProps, NovelState } from './novelDec';
import { Location, LocationDataValue } from '../location/locationDec';
import { Character, CharacterDataValue } from '../character/characterDec';
import { OutlineDataValue, Outline } from '../sidebar/sidebarDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getAllCharactersGivenNovel } from '../../../db/operations/character-ops';
import { getAllOutlinesGivenNovel } from '../../../db/operations/outline-ops';
import { getAllLocationsGivenNovel } from '../../../db/operations/location-ops';

// utils
import { imageMapping } from '../../utils/constants';
import { ctrlsPress } from '../../utils/utils';

// sass
import './novel.scss';

class Novel extends React.Component<NovelProps, NovelState> {
	constructor(props: NovelProps) {
		super(props);
		this.state = {
			id: props.match.params.id,
			name: '',
			description: '',
			categories: [],
			characters: [],
			outlines: [],
			locations: [],
			createCharacter: false,
			createOutline: false,
			createLocation: false,
			shouldRenderCharacter: false,
			shouldRenderOutline: false,
			shouldRenderLocation: false,
			isEdit: false,
			batchDelete: false,
			save: false
		};
	}

	componentDidMount = () => {
		const { id } = this.props.match.params;
		this.getCharacters(id);
		this.getOutlines(id);
		this.getLocations(id);
	}

	componentWillReceiveProps = (props: NovelProps) => {
		const { id } = props.match.params;
		this.setState({ id });

		this.getCharacters(id);
		this.getOutlines(id);
		this.getLocations(id);
	}

	// create character
	onCreateCharacter = () => {
		this.setState({ createCharacter: true });
	}

	// create outline
	onCreateOutline = () => {
		this.setState({ createOutline: true });
	}

	// create location
	onCreateLocation = () => {
		this.setState({ createLocation: true });
	}

	// cancel create character
	onCancelCreateCharacter = () => {
		this.setState({ createCharacter: false });
	}

	// cancel create outline
	onCancelCreateOutline = () => {
		this.setState({ createOutline: false });
	}

	// cancel create location
	onCancelCreateLocation = () => {
		this.setState({ createLocation: false });
	}

	// enter edit mode
	onEnterEditMode = () => {
		this.setState({ isEdit: true });
		// add event listener for control + s
		document.addEventListener('keydown', this.onSavePress);
	}

	// quit edit mode
	onQuitEditMode = () => {
		this.setState({ isEdit: false });
		// remove event listener
		document.removeEventListener('keydown', this.onSavePress);
	}

	// should batch delete
	onBatchDelete = () => {
		this.setState({ batchDelete: true });
	}

	// reset batch deletion status
	onResetBatchDelete = () => {
		this.setState({ batchDelete: false });
	}

	// should save
	onSave = () => {
		this.setState({ save: true });
	}

	// reset save status
	onResetSave = () => {
		this.setState({ save: false });
	}

	// should save and then reset save
	onSaveAndReset = async () => {
		await this.onSave();
		this.onResetSave();
	}

	// when save shortcut is presses
	onSavePress = (e: KeyboardEvent) => {
		ctrlsPress(e, this.onSaveAndReset);
	}

	// get all characters
	getCharacters = (id: string) => {
		getAllCharactersGivenNovel(id)
			.then((result: any) => {
				// get all characters
				const characters: Character[] = result.map(({ dataValues }: { dataValues: CharacterDataValue }) => {
					const { id, name, color, image, gender } = dataValues;
					return { id, name, color, image: image ? image : imageMapping[gender ? gender : 0] };
				});

				// set characters
				this.setState({ characters, shouldRenderCharacter: true });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all outlines
	getOutlines = (id: string) => {
		getAllOutlinesGivenNovel(id)
			.then((result: any) => {
				const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
					const { id, title, description } = dataValues;
					return { id, title, description };
				});

				// set outlines
				this.setState({ outlines, shouldRenderOutline: true });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all locations
	getLocations = (id: string) => {
		getAllLocationsGivenNovel(id)
			.then((result: any) => {
				const locations: Location[] = result.map(({ dataValues }: { dataValues: LocationDataValue }) => {
					const { id, image, intro, texture, location, controller, name } = dataValues;
					return { id, image, intro, texture, location, controller, name };
				});

				// set locations
				this.setState({ locations, shouldRenderLocation: true });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand, refreshSidebar } = this.props;
		const {
			id, characters, outlines, locations, isEdit, save,
			createCharacter, createOutline, createLocation,
			shouldRenderCharacter, shouldRenderOutline, shouldRenderLocation, batchDelete
		} = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('novel', {
						'main-grow': !expand
					})
				}
			>
				<NovelHeader
					refreshCharacter={this.getCharacters}
					refreshOutline={this.getOutlines}
					refreshLocation={this.getLocations}
					refreshSidebar={refreshSidebar}
					createCharacter={createCharacter}
					createOutline={createOutline}
					createLocation={createLocation}
					cancelCreateCharacter={this.onCancelCreateCharacter}
					cancelCreateOutline={this.onCancelCreateOutline}
					cancelCreateLocation={this.onCancelCreateLocation}
					id={id}
					isEdit={isEdit}
					enterEditMode={this.onEnterEditMode}
					quitEditMode={this.onQuitEditMode}
					batchDelete={this.onBatchDelete}
					resetBatchDelete={this.onResetBatchDelete}
					onSave={this.onSave}
					resetSave={this.onResetSave}
				/>
				<div className="novel-content">
					<IntroSection
						novel_id={id}
						isEdit={isEdit}
						shouldSave={save}
					/>
					<Collapse defaultActiveKey={['background', 'characters', 'outlines', 'locations']}>
						<Panel header="背景设定" key="background">
							<BackgroundSection
								novel_id={id}
								isEdit={isEdit}
							/>
						</Panel>
						<Panel header="角色列表" key="characters">
							{
								shouldRenderCharacter && (
									<CharacterSection
										characters={characters}
										novel_id={id}
										onCreateCharacter={this.onCreateCharacter}
										refreshCharacter={this.getCharacters}
										isEdit={isEdit}
										batchDelete={batchDelete}
										save={save}
									/>
								)
							}
						</Panel>
						<Panel header="势力列表" key="locations">
							{
								shouldRenderLocation && (
									<LocationSection
										locations={locations}
										novel_id={id}
										onCreateLocation={this.onCreateLocation}
										refreshLocation={this.getLocations}
										isEdit={isEdit}
										batchDelete={batchDelete}
										save={save}
									/>
								)
							}
						</Panel>
						<Panel header="大纲列表" key="outlines">
							{
								shouldRenderOutline && (
									<OutlineSection
										outlines={outlines}
										novel_id={id}
										onCreateOutline={this.onCreateOutline}
										refreshOutline={this.getOutlines}
										isEdit={isEdit}
										batchDelete={batchDelete}
										save={save}
									/>
								)
							}
						</Panel>
					</Collapse>
				</div>
			</Col>
		);
	}
}

export default withRouter(Novel);
