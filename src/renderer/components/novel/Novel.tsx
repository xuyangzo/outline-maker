import * as React from 'react';
import { Col, message as Message, Card, Row, Collapse, Icon } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import NovelHeader from '../novel-header/NovelHeader';

// type declaration
import { NovelProps, NovelState } from './novelDec';
import { Character, CharacterDataValue } from '../main/mainDec';
import { NovelDataValue, OutlineDataValue, Outline } from '../sidebar/sidebarDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getNovelById } from '../../../db/operations/novel-ops';
import { getAllCharactersByNovel } from '../../../db/operations/character-ops';
import { getAllOutlinesGivenNovel } from '../../../db/operations/outline-ops';

// utils
import { imageMapping } from '../../utils/constants';

// sass
import './novel.scss';

// image
import shadow from '../../../public/shadow-person.jpg';

class Novel extends React.Component<NovelProps, NovelState> {
	constructor(props: NovelProps) {
		super(props);
		this.state = {
			name: '',
			description: '',
			categories: [],
			characters: [],
			outlines: [],
			createCharacter: false,
			shouldRenderCharacter: false
		};
	}

	componentDidMount = () => {
		const { id } = this.props.match.params;
		this.getNovelContent(id);
		this.getCharacters(id);
		this.getOutlines(id);
	}

	componentWillReceiveProps = (props: NovelProps) => {
		const { id } = props.match.params;
		this.getNovelContent(id);
		this.getCharacters(id);
		this.getOutlines(id);
	}

	// cancel create character
	onCancelCreateCharacter = () => {
		this.setState({ createCharacter: false });
	}

	// get novel content
	getNovelContent = (id: string) => {
		getNovelById(id)
			.then(({ dataValues }: { dataValues: NovelDataValue }) => {
				this.setState({
					name: dataValues.name,
					description: dataValues.description,
					categories: dataValues.categories.split(',')
				});
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
				this.setState({ outlines });
			});
	}

	render() {
		const { expand } = this.props;
		const { name, description, characters, outlines, createCharacter, shouldRenderCharacter } = this.state;

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
					createCharacter={createCharacter}
					cancelCreateCharacter={this.onCancelCreateCharacter}
				/>
				<div className="novel-content">
					<h2>{name}</h2>
					<p className="novel-description">{description}</p>
					<br />
					<Collapse defaultActiveKey={['characters', 'outlines']}>
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
													this.props.history.push(`/outline/${outline.id}`);
												}}
											>
												<p>{outline.description}</p>
											</Card>
										</Col>
									))
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
