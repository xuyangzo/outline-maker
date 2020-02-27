import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Tooltip } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter, Link } from 'react-router-dom';

// type declaration
import {
	CharacterProps, CharacterState, OutlineCharacterDataValue,
	CharacterDataValue, InventoryCharacterDataValue
} from './characterDec';

// database operations
import { getCharacter } from '../../../db/operations/character-ops';
import { getAllOutlinesGivenCharacter } from '../../../db/operations/outline-ops';
import { getAllInventoriesGivenCharacter } from '../../../db/operations/inventory-ops';

// utils
import { imageMapping, characterIllustrations, mapGenderText } from '../../utils/constants';
import { Property } from '../../utils/components';

// sass
import './character.scss';

class Character extends React.Component<CharacterProps, CharacterState> {
	constructor(props: CharacterProps) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			novel_id: this.props.match.params.novel_id,
			name: '',
			image: '',
			age: '',
			nickname: '',
			gender: 0,
			height: '',
			identity: '',
			appearance: '',
			characteristics: '',
			experience: '',
			note: '',
			outlines: [],
			inventories: []
		};
	}

	componentDidMount = () => {
		this.setCharacter();
		this.setOutlines();
		this.setInventories();
	}

	// set information about a single character
	setCharacter = () => {
		getCharacter(this.state.id)
			.then((character: CharacterDataValue) => {
				this.setState({ ...character });
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	// set outline information about a character
	setOutlines = () => {
		getAllOutlinesGivenCharacter(this.state.id)
			.then((outlines: OutlineCharacterDataValue[]) => {
				this.setState({ outlines });
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	// set inventories information about a inventory
	setInventories = () => {
		getAllInventoriesGivenCharacter(this.state.id)
			.then((inventories: InventoryCharacterDataValue[]) => {
				this.setState({ inventories });
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	render() {
		const { expand } = this.props;
		const {
			name, image, age, nickname, gender, height, outlines, inventories,
			identity, appearance, characteristics, experience, note, id
		} = this.state;

		// mapping of image
		const imageURL = image ? image : imageMapping[gender ? gender : 0];
		const genderText: string = mapGenderText(gender);

		return (
			<Col
				span={19}
				className={
					classnames('character right-container', {
						'main-grow': !expand
					})
				}
			>
				<PageHeader
					title={''}
					onBack={() => { this.props.history.goBack(); }}
					className="main-header"
					extra={[
						<Button
							key="edit"
							type="danger"
							className="orange-button"
							onClick={() => { this.props.history.push(this.props.location.pathname.concat('/edit')); }}
							ghost
						>
							<Icon type="edit" />编辑
						</Button>
					]}
				/>
				<div className="character-content">
					<Row className="character-section">
						<Col span={9}>
							<img src={imageURL} alt="profile image" className="profile-image" />
						</Col>
						<Col span={15} className="character-edit-content">
							<Row className="character-section">
								<h2 className="character-name">{name}</h2>
							</Row>
							<Property
								tip={characterIllustrations.nickname}
								fieldName="昵称"
								text={nickname}
							/>
							<Property
								tip=""
								fieldName="性别"
								text={genderText}
							/>
							<Property
								tip=""
								fieldName="年龄"
								text={age}
							/>
							<Property
								tip=""
								fieldName="身高"
								text={height}
							/>
							<Property
								tip={characterIllustrations.identity}
								fieldName="身份"
								text={identity}
							/>
							<Property
								tip={characterIllustrations.appearance}
								fieldName="外貌"
								text={appearance}
							/>
							<Property
								tip={characterIllustrations.characteristics}
								fieldName="性格"
								text={characteristics}
							/>
							<Property
								tip={characterIllustrations.experience}
								fieldName="经历"
								text={experience}
							/>
							<Property
								tip=""
								fieldName="备注"
								text={note}
							/>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>
									大纲
									<Tooltip
										placement="rightTop"
										title={characterIllustrations.outlines}
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={16}>
									{
										!outlines.length && (<p>暂无</p>)
									}
									{
										outlines.map((outline: OutlineCharacterDataValue, index: number) => (
											<Link key={outline.id} to={`/outline/${id}/${outline.id}`} className="custom-link">
												{index + 1}.&nbsp;{outline.title}
											</Link>
										))
									}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>
									道具
									<Tooltip
										placement="rightTop"
										title={characterIllustrations.inventories}
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={16}>
									{
										!inventories.length && (<p>暂无</p>)
									}
									{
										inventories.map((inventory: InventoryCharacterDataValue, index: number) => (
											<Link key={inventory.id} to={`/inventory/${id}/${inventory.id}`} className="custom-link-blue">
												{index + 1}.&nbsp;{inventory.name}
											</Link>
										))
									}
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</Col>
		);
	}
}

export default withRouter(Character);
