import * as React from 'react';
import { Col, message as Message, Collapse } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import CharacterTrash from './character-trash/CharacterTrash';
import OutlineTrash from './outline-trash/OutlineTrash';
import LocationTrash from './location-trash/LocationTrash';

// type declaration
import { DatabaseError } from 'sequelize';
import { TrashProps, TrashState, TrashDataValue } from './TrashDec';

// database operations
import { getAllTrashes } from '../../../db/operations/trash-ops';

// sass
import './trash.scss';

// image
import empty from '../../../public/empty-trash.png';

class Trash extends React.Component<TrashProps, TrashState> {
	constructor(props: TrashProps) {
		super(props);
		this.state = {
			outlines: [],
			characters: [],
			locations: [],
			shouldRender: false
		};
	}

	componentDidMount = () => {
		this.getTrashes();
	}

	// get all trashes
	getTrashes = () => {
		getAllTrashes()
			.then((result: any) => {
				// filter novels, outlines, characters, locations
				const novels: number[] = [];
				const outlines: number[] = [];
				const characters: number[] = [];
				const locations: number[] = [];
				result.forEach(({ dataValues }: { dataValues: TrashDataValue }) => {
					const { novel_id, outline_id, character_id, loc_id } = dataValues;
					/**
					 * each array does not conflict with each other
					 */
					if (novel_id) novels.push(novel_id);
					if (outline_id) outlines.push(outline_id);
					if (character_id) characters.push(character_id);
					if (loc_id) locations.push(loc_id);
				});

				this.setState({ outlines, characters, locations, shouldRender: true });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand } = this.props;
		const { shouldRender, outlines, characters, locations } = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('trash', {
						'main-grow': !expand
					})
				}
			>
				{
					!outlines.length && !characters.length && !locations.length && shouldRender && (
						<div className="empty-trash">
							<h2>垃圾箱是空的哟...</h2>
							<br />
							<img src={empty} alt="empty trash" />
						</div>
					)
				}
				<Collapse defaultActiveKey={['characters', 'locations', 'outlines']}>
					{
						characters.length && shouldRender && (
							<Panel header="角色列表" key="characters">
								<CharacterTrash
									characters={characters}
									refresh={this.getTrashes}
								/>
							</Panel>
						)
					}
					{
						locations.length && shouldRender && (
							<Panel header="势力列表" key="locations">
								<LocationTrash
									locations={locations}
									refresh={this.getTrashes}
								/>
							</Panel>
						)
					}
					{
						outlines.length && shouldRender && (
							<Panel header="大纲列表" key="outlines">
								<OutlineTrash
									outlines={outlines}
									refresh={this.getTrashes}
								/>
							</Panel>
						)
					}
				</Collapse>
			</Col>
		);
	}
}

export default withRouter(Trash);
