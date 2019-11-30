import * as React from 'react';
import { Col, message as Message } from 'antd';
import classnames from 'classnames';

// custom components
import MainHeader from '../main-header/MainHeader';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { OutlineDataValue } from '../sidebar/sidebarDec';
import { MainProps, MainState, CharacterDataValue, Character } from './mainDec';
import { DatabaseError } from 'sequelize';

// sequelize modals
import Outlines from '../../../db/models/Outlines';
import CharacterModal from '../../../db/models/Character';

// sass
import './main.scss';

class Main extends React.Component<MainProps, MainState> {
	constructor(props: MainProps) {
		super(props);
		this.state = {
			id: -1,
			title: '标题',
			description: '描述...',
			characters: []
		};
	}

	componentWillReceiveProps = (props: MainProps) => {
		const { id } = props.match.params;
		// get outline's id, title and description
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

		// get characters
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
				this.setState(
					(prevState: MainState) => ({
						...prevState,
						characters
					}),
					() => {
						// cancel update
						props.cancelRefreshMain();
					});
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	componentDidMount = () => {
		const { id } = this.props.match.params;
		// get outline's id, title and description
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

		// get characters
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

	// save all changes
	onSave = () => {
		const { id } = this.props.match.params;
		const promises: Promise<any>[] = [];
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
			}
		});

		Promise
			.all(promises)
			.then(() => {
				// alert success
				Message.success('保存成功！');
				// refresh main content
				// setTimeout(() => {
				// 	this.props.refreshMain();
				// }, 3000);
				this.props.refreshMain();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// create character locally (not publish to database)
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
			characters: prevState.characters.concat(newCharacter)
		}));
	}

	render() {
		const { expand, refreshSidebar, refreshMain } = this.props;
		const { title, description } = this.state;

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
					onSave={this.onSave}
				/>
				<div className="main-content">
					<table>
						<tr>
							<th className="timeline-header">
								<div className="timeline-component" >ceshi</div>
							</th>
							{
								this.state.characters.map((character: Character, index: number) => (
									<th key={character.id}>
										<div
											className={classnames('main-character-card', {
												'first-person-th': index === 0
											})}
										>{character.name}
										</div>
									</th>
								))
							}
						</tr>
					</table>
				</div>
			</Col>
		);
	}
}

export default withRouter(Main);
