import * as React from 'react';
import { Col, message as Message, Card, Row, Collapse, Icon, Button } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import NovelHeader from '../novel-header/NovelHeader';

// type declaration
import { NovelProps, NovelState } from './novelDec';
import { BackgroundDataValue } from '../background/backgroundDec';
import { Location, LocationDataValue } from '../location/locationDec';
import { Character, CharacterDataValue } from '../character/characterDec';
import { NovelDataValue, OutlineDataValue, Outline } from '../sidebar/sidebarDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getNovelById } from '../../../db/operations/novel-ops';
import { getAllCharactersByNovel } from '../../../db/operations/character-ops';
import { getAllOutlinesGivenNovel } from '../../../db/operations/outline-ops';
import { getAllLocationsByNovel } from '../../../db/operations/location-ops';
import { getWordviewGivenNovel } from '../../../db/operations/background-ops';

// utils
import { tagColors, imageMapping } from '../../utils/constants';

// sass
import './novel.scss';

// image
import unknownArea from '../../../public/unknown_gray.jpg';

class Novel extends React.Component<NovelProps, NovelState> {
	constructor(props: NovelProps) {
		super(props);
		this.state = {
			id: props.match.params.id,
			name: '',
			description: '',
			wordview: '',
			categories: [],
			characters: [],
			outlines: [],
			locations: [],
			createCharacter: false,
			createOutline: false,
			createLocation: false,
			shouldRenderCharacter: false,
			shouldRenderOutline: false,
			shouldRenderLocation: false
		};
	}

	componentDidMount = () => {
		const { id } = this.props.match.params;
		this.getNovelContent(id);
		this.getWorldview(id);
		this.getCharacters(id);
		this.getOutlines(id);
		this.getLocations(id);
	}

	componentWillReceiveProps = (props: NovelProps) => {
		const { id } = props.match.params;
		this.setState({ id });

		this.getNovelContent(id);
		this.getWorldview(id);
		this.getCharacters(id);
		this.getOutlines(id);
		this.getLocations(id);
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

	// get novel content
	getNovelContent = (id: string) => {
		getNovelById(id)
			.then(({ dataValues }: { dataValues: NovelDataValue }) => {
				this.setState({
					name: dataValues.name,
					description: dataValues.description,
					categories: dataValues.categories ? dataValues.categories.split(',') : []
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get worldview
	getWorldview = (id: string) => {
		getWordviewGivenNovel(id)
			.then(({ dataValues }: { dataValues: BackgroundDataValue }) => {
				this.setState({ wordview: dataValues.content });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// get all characters
	getCharacters = (id: string) => {
		getAllCharactersByNovel(id)
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
		getAllLocationsByNovel(id)
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
		const { expand } = this.props;
		const {
			id, name, description, wordview, characters, outlines, categories, locations,
			createCharacter, createOutline, createLocation,
			shouldRenderCharacter, shouldRenderOutline, shouldRenderLocation
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
					createCharacter={createCharacter}
					createOutline={createOutline}
					createLocation={createLocation}
					cancelCreateCharacter={this.onCancelCreateCharacter}
					cancelCreateOutline={this.onCancelCreateOutline}
					cancelCreateLocation={this.onCancelCreateLocation}
					id={id}
				/>
				<div className="novel-content">
					<h2 style={{ display: 'inline-block', marginRight: '10px' }}>{name}</h2>
					{
						categories.map((category: string, index: number) => (
							<div
								className="novel-tag"
								key={category}
								style={{
									color: tagColors[index],
									borderColor: tagColors[index]
								}}
							>{category}
							</div>
						))
					}
					{
						!categories.length && (
							<div className="novel-tag">暂无标签</div>
						)
					}
					<p className="novel-description">{description}</p>
					<br />
					<Collapse defaultActiveKey={['background', 'characters', 'outlines', 'locations']}>
						<Panel header="背景设定" key="background">
							<div className="background-property">
								{wordview}
							</div>
							<Button
								type="primary"
								className="green-button borderless-button"
								style={{ marginLeft: 15, marginTop: 20 }}
								onClick={() => { this.props.history.push(`/background/${this.props.match.params.id}`); }}
								ghost
							>
								查看更多设定 <Icon type="arrow-right" />
							</Button>
						</Panel>
						<Panel header="人物列表" key="characters">
							<Row>
								{
									characters.map((character: Character) => (
										<Col span={6} key={character.id}>
											<Card
												title={character.name}
												bordered={false}
												hoverable
												className="custom-card"
												onClick={() => {
													this.props.history.push(`/character/${this.props.match.params.id}/${character.id}`);
												}}
											>
												<img src={character.image} alt="no person" />
											</Card>
										</Col>
									))
								}
								{
									shouldRenderCharacter && !characters.length && (
										<Col span={6}>
											<Card
												title="还没有角色哦..."
												bordered={false}
												hoverable
												className="custom-card add-character-card"
												onClick={() => { this.setState({ createCharacter: true }); }}
											>
												<Icon type="user-add" /> 新建角色
											</Card>
										</Col>
									)
								}
							</Row>
						</Panel>
						<Panel header="势力列表" key="locations">
							<Row>
								{
									locations.map((location: Location) => (
										<Col span={8} key={location.id}>
											<Card
												title={location.name}
												bordered={false}
												hoverable
												className="custom-card location-card"
												onClick={() => {
													this.props.history.push(`/location/${this.props.match.params.id}/${location.id}`);
												}}
											>
												<img src={location.image ? location.image : unknownArea} alt="没图" />
											</Card>
										</Col>
									))
								}
								{
									shouldRenderLocation && !locations.length && (
										<Col span={6}>
											<Card
												title="还没有势力哦..."
												bordered={false}
												hoverable
												className="custom-card add-character-card"
												onClick={() => { this.setState({ createLocation: true }); }}
											>
												<Icon type="usergroup-add" /> 新建势力
											</Card>
										</Col>
									)
								}
							</Row>
						</Panel>
						<Panel header="大纲列表" key="outlines">
							<Row>
								{
									outlines.map((outline: Outline) => (
										<Col span={6} key={outline.id}>
											<Card
												title={outline.title}
												bordered={false}
												hoverable
												className="custom-card outline-card"
												onClick={() => {
													this.props.history.push(`/outline/${id}/${outline.id}`);
												}}
											>
												<p>{outline.description}</p>
											</Card>
										</Col>
									))
								}
								{
									shouldRenderOutline && !outlines.length && (
										<Col span={6}>
											<Card
												title="还没有大纲哦..."
												bordered={false}
												hoverable
												className="custom-card add-character-card"
												onClick={() => { this.setState({ createOutline: true }); }}
											>
												<Icon type="file-add" /> 新建大纲
											</Card>
										</Col>
									)
								}
							</Row>
						</Panel>
					</Collapse>
				</div>
			</Col>
		);
	}
}

export default withRouter(Novel);
