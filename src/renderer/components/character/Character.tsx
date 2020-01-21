import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Tooltip } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter, Link } from 'react-router-dom';

// type declaration
import {
	CharacterProps, CharacterState, Character as CharacterDec,
	OutlineGivenCharacter
} from './characterDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getCharacter } from '../../../db/operations/character-ops';
import { getAllOutlinesGivenCharacter } from '../../../db/operations/outline-ops';

// utils
import { imageMapping, characterIllustrations } from '../../utils/constants';

// sass
import './character.scss';

class Character extends React.Component<CharacterProps, CharacterState> {
	constructor(props: CharacterProps) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			outline_id: -1,
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
			outlines: []
		};
	}

	componentDidMount = () => {
		this.setCharacter();
		this.setOutlines();
	}

	// set information about a single character
	setCharacter = () => {
		getCharacter(this.state.id)
			.then(({ dataValues }: { dataValues: CharacterDec }) => {
				const {
					outline_id, name, image, age, nickname, gender,
					height, identity, appearance, characteristics, experience
				} = dataValues;
				this.setState({
					outline_id, name, image, age, nickname, gender,
					height, identity, appearance, characteristics, experience
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	// set outline information about a character
	setOutlines = () => {
		getAllOutlinesGivenCharacter(this.state.id)
			.then((result: any) => {
				console.log('result', result);
				const outlines: OutlineGivenCharacter[] = result.map(
					({ dataValues }: { dataValues: OutlineGivenCharacter }) => dataValues);
				this.setState({ outlines });
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	render() {
		const { expand } = this.props;
		const {
			name, image, age, nickname, gender, height, outlines,
			identity, appearance, characteristics, experience, id
		} = this.state;

		// mapping of image
		const imageURL = image ? image : imageMapping[gender ? gender : 0];

		let genderText;
		switch (gender) {
			case 0:
				genderText = '男';
				break;
			case 1:
				genderText = '女';
				break;
			case 2:
				genderText = '不明';
				break;
			case 3:
				genderText = '大雕萌妹';
				break;
			default:
				break;
		}

		return (
			<Col
				span={19}
				className={
					classnames('character', {
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
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>
									昵称
									<Tooltip
										placement="rightTop"
										title={characterIllustrations.nickname}
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={16}>
									{nickname ? nickname : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>性别：</Col>
								<Col span={16}>
									{genderText ? genderText : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>年龄：</Col>
								<Col span={16}>
									{age ? age : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>身高：</Col>
								<Col span={16}>
									{height ? height : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>
									身份
									<Tooltip
										placement="rightTop"
										title={characterIllustrations.identity}
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={16} className="numbered-text">
									{identity ? identity : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>
									外貌
									<Tooltip
										placement="rightTop"
										title={characterIllustrations.appearance}
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={16} className="numbered-text">
									{appearance ? appearance : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>
									性格
									<Tooltip
										placement="rightTop"
										title={characterIllustrations.characteristics}
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={16} className="numbered-text">
									{characteristics ? characteristics : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>
									经历
									<Tooltip
										placement="rightTop"
										title={characterIllustrations.experience}
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={16} className="numbered-text">
									{experience ? experience : '暂无'}
								</Col>
							</Row>
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
										outlines.map((outline: OutlineGivenCharacter, index: number) => (
											<Link key={outline.id} to={`/outline/${id}/${outline.id}`} className="custom-link">
												{index + 1}.&nbsp;{outline.title}
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
