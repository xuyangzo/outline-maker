import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Tooltip } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { CharacterProps, CharacterState, Character as CharacterDec } from './characterDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getCharacter } from '../../../db/operations/character-ops';

// utils
import { getNumberedText } from '../../utils/utils';
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
			experience: ''
		};
	}

	componentDidMount = () => {
		this.setCharacter();
	}

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

	render() {
		const { expand } = this.props;
		const {
			name, image, age, nickname, gender, novel_id,
			height, identity, appearance, characteristics, experience
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
					onBack={() => { this.props.history.go(-1); }}
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
						<Col span={10}>
							<img src={imageURL} alt="profile image" className="profile-image" />
						</Col>
						<Col span={14} style={{ paddingLeft: '40px' }}>
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
								<Col span={8}>
									{nickname ? nickname : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>性别：</Col>
								<Col span={8}>
									{genderText ? genderText : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>年龄：</Col>
								<Col span={8}>
									{age ? age : '暂无'}
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>身高：</Col>
								<Col span={8}>
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
									{identity ? getNumberedText(identity) : '暂无'}
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
									{appearance ? getNumberedText(appearance) : '暂无'}
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
									{characteristics ? getNumberedText(characteristics) : '暂无'}
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
									{experience ? getNumberedText(experience) : '暂无'}
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
