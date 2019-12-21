import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Select, Upload, Tooltip } from 'antd';
import classnames from 'classnames';
const { Option } = Select;

// file stream
const fs = require('fs');

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { CharacterProps, CharacterEditState, Character as CharacterDec } from './characterDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getCharacter, updateCharacterDetail } from '../../../db/operations/character-ops';

// utils
import { ctrlsPress } from '../../utils/utils';
import { imageMapping, characterIllustrations } from '../../utils/constants';

// sass
import './character.scss';

class Character extends React.Component<CharacterProps, CharacterEditState> {
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
			identity: [],
			appearance: [],
			characteristics: [],
			experience: []
		};
	}

	componentDidMount = () => {
		// add event listener for save shortcut
		document.addEventListener('keydown', this.onSavePress);

		this.setCharacter();
	}

	componentWillUnmount = () => {
		// remove event listener
		document.removeEventListener('keydown', this.onSavePress);
	}

	// when save shortcut is presses
	onSavePress = (e: KeyboardEvent) => {
		ctrlsPress(e, this.onSave);
	}

	// when input field changes
	onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	// when numbered input field changes
	onNumberedInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const type: string = e.target.name;
		const value: string = e.target.value;
		this.setState((prevState: CharacterEditState) => ({
			...prevState,
			[type]: (prevState[type]).map((item: any, i: number) => {
				if (i === index) return value;
				return item;
			})
		}));
	}

	// when select gender
	onSelectGender = (value: string) => {
		this.setState({ gender: parseInt(value, 10) });
	}

	// when add input
	onAddInput = (type: string) => {
		this.setState((prevState: CharacterEditState) => ({
			...prevState,
			[type]: (prevState[type]).concat('')
		}));
	}

	// when delete input
	onDeleteInput = (type: string, index: number) => {
		this.setState((prevState: CharacterEditState) => ({
			...prevState,
			[type]: (prevState[type]).filter((item: any, i: number) => i !== index)
		}));
	}

	/**
	 * upload image
	 * key idea is to store the absolute path of image in db
	 * but img tag cannot display src with absolute path
	 * because the path is beyond the control of the browser
	 * so use node to read the image and convert it to base64 string
	 * store the base64 string in the database
	 */
	onImageUpload = (file: any) => {
		const { path, type } = file;

		// check if file type is image
		if (type.indexOf('image') === -1) {
			Message.error('只能选择图片！');
			return false;
		}

		// read file based on system path
		fs.readFile(path, (err: any, data: any) => {
			// if cannot read the image
			if (err) {
				Message.error('无法读取图片！');
				return false;
			}

			// convert buffer to base64 string format
			const imageStr: string = `data:${type};base64,${Buffer.from(data).toString('base64')}`;
			this.setState({ image: imageStr });
			return false;
		});

		return false;
	}

	// when save the event
	onSave = (): Promise<any> => {
		const {
			id, name, image, age, nickname, gender, height,
			identity, appearance, characteristics, experience
		} = this.state;

		// filter invalid input
		const props: { [key: string]: string | number } = {
			name, image, age, nickname, gender, height,
			identity: identity.filter(a => a).join(','),
			appearance: appearance.filter(a => a).join(','),
			characteristics: characteristics.filter(a => a).join(','),
			experience: experience.filter(a => a).join(',')
		};

		return updateCharacterDetail(id, props)
			.then(() => {
				Message.success('保存成功！');
				return Promise.resolve();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// when save and quit
	onSaveAndQuit = () => {
		this.onSave()
			.then(() => {
				this.props.history.go(-1);
			});
	}

	// set the character's info
	setCharacter = () => {
		getCharacter(this.state.id)
			.then(({ dataValues }: { dataValues: CharacterDec }) => {
				const {
					outline_id, name, image, age, nickname, gender,
					height, identity, appearance, characteristics, experience
				} = dataValues;
				/**
				 * need to filter all the empty field (set to '')
				 * in order not to convert controlled components to uncontrolled components
				 * uncontrolled input components = value is undefined/null
				 */
				this.setState({
					outline_id,
					name,
					image: image ? image : '',
					age: age ? age : '',
					nickname: nickname ? nickname : '',
					height: height ? height : '',
					gender: gender ? gender : 0,
					identity: identity ? identity.split(',') : [''],
					appearance: appearance ? appearance.split(',') : [''],
					characteristics: characteristics ? characteristics.split(',') : [''],
					experience: experience ? experience.split(',') : ['']
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	render() {
		const { expand } = this.props;
		const {
			name, image, age, nickname, gender,
			height, identity, appearance, characteristics, experience
		} = this.state;

		// mapping of image
		const imageURL = image ? image : imageMapping[gender];

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
							key="quit"
							type="danger"
							ghost
							onClick={() => { this.props.history.go(-1); }}
						>
							<Icon type="rollback" />取消编辑
						</Button>,
						<Button
							key="edit"
							type="danger"
							className="green-button"
							onClick={this.onSaveAndQuit}
							ghost
						>
							<Icon type="edit" />保存并退出编辑
						</Button>
					]}
				/>
				<div className="character-content">
					<Row className="character-section">
						<Col span={10} style={{ paddingTop: 25 }}>
							<Upload
								name="profile-image"
								customRequest={this.onImageUpload}
								showUploadList={false}
								beforeUpload={this.onImageUpload}
								style={{ width: '100%' }}
							>
								<Button>
									<Icon type="upload" /> 选择图片
								</Button>
							</Upload>
							<img src={imageURL} alt="无法读取图片，请选择新的图片" className="profile-image" />
						</Col>
						<Col span={14} style={{ paddingLeft: '40px' }}>
							<Row className="character-section">
								<input
									type="text"
									value={name}
									name="name"
									onChange={this.onInputChange}
									placeholder="角色姓名"
									className="character-input character-name-input medium-input"
								/>
							</Row>
							<Row className="character-section" align="middle">
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
									<input
										type="text"
										value={nickname}
										name="nickname"
										onChange={this.onInputChange}
										placeholder="昵称"
										className="character-input"
									/>
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>性别：</Col>
								<Col span={8}>
									<Select value={gender.toString()} style={{ width: 120 }} onChange={this.onSelectGender}>
										<Option value="0">男</Option>
										<Option value="1">女</Option>
										<Option value="2">未知</Option>
										<Option value="3">大雕萌妹</Option>
									</Select>
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>年龄：</Col>
								<Col span={8}>
									<input
										type="text"
										value={age}
										name="age"
										onChange={this.onInputChange}
										placeholder="角色年龄"
										className="character-input short-input"
									/>
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>身高：</Col>
								<Col span={8}>
									<input
										type="text"
										value={height}
										name="height"
										onChange={this.onInputChange}
										placeholder="角色身高"
										className="character-input short-input"
									/>
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
								<Col span={20}>
									{
										identity.map((identityItem: string, index: number) => (
											<React.Fragment key={index}>
												{index + 1}.&nbsp;
												<input
													type="text"
													value={identityItem}
													name="identity"
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onNumberedInputChange(e, index)}
													placeholder="角色身份"
													className="character-input long-input"
												/>
												&nbsp;
												<div className="delete-icon-container">
													<Icon
														type="delete"
														className="delete-icon"
														onClick={() => this.onDeleteInput('identity', index)}
													/>
												</div>
												<br />
											</React.Fragment>
										))
									}
									<Button
										type="primary"
										ghost
										className="green-button"
										style={{
											width: 420,
											marginTop: 5,
											marginBottom: 10,
											height: 25
										}}
										onClick={() => this.onAddInput('identity')}
									>
										<Icon type="plus" />
									</Button>
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
								<Col span={20} className="numbered-text">
									{
										appearance.map((appearanceItem: string, index: number) => (
											<React.Fragment key={index}>
												{index + 1}.&nbsp;
												<input
													type="text"
													value={appearanceItem}
													name="appearance"
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onNumberedInputChange(e, index)}
													placeholder="角色外貌"
													className="character-input long-input"
												/>
												&nbsp;
												<div className="delete-icon-container">
													<Icon
														type="delete"
														className="delete-icon"
														onClick={() => this.onDeleteInput('appearance', index)}
													/>
												</div>
												<br />
											</React.Fragment>
										))
									}
									<Button
										type="primary"
										ghost
										className="green-button"
										style={{
											width: 420,
											marginTop: 5,
											marginBottom: 10,
											height: 25
										}}
										onClick={() => this.onAddInput('appearance')}
									>
										<Icon type="plus" />
									</Button>
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
								<Col span={20} className="numbered-text">
									{
										characteristics.map((characteristicsItem: string, index: number) => (
											<React.Fragment key={index}>
												{index + 1}.&nbsp;
												<input
													type="text"
													value={characteristicsItem}
													name="characteristics"
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onNumberedInputChange(e, index)}
													placeholder="角色性格"
													className="character-input long-input"
												/>
												&nbsp;
												<div className="delete-icon-container">
													<Icon
														type="delete"
														className="delete-icon"
														onClick={() => this.onDeleteInput('characteristics', index)}
													/>
												</div>
												<br />
											</React.Fragment>
										))
									}
									<Button
										type="primary"
										ghost
										className="green-button"
										style={{
											width: 420,
											marginTop: 5,
											marginBottom: 10,
											height: 25
										}}
										onClick={() => this.onAddInput('characteristics')}
									>
										<Icon type="plus" />
									</Button>
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
								<Col span={20} className="numbered-text">
									{
										experience.map((experienceItem: string, index: number) => (
											<React.Fragment key={index}>
												{index + 1}.&nbsp;
												<input
													type="text"
													value={experienceItem}
													name="experience"
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onNumberedInputChange(e, index)}
													placeholder="角色经历"
													className="character-input long-input"
												/>
												&nbsp;
												<div className="delete-icon-container">
													<Icon
														type="delete"
														className="delete-icon"
														onClick={() => this.onDeleteInput('experience', index)}
													/>
												</div>
												<br />
											</React.Fragment>
										))
									}
									<Button
										type="primary"
										ghost
										className="green-button"
										style={{
											width: 420,
											marginTop: 5,
											marginBottom: 10,
											height: 25
										}}
										onClick={() => this.onAddInput('experience')}
									>
										<Icon type="plus" />
									</Button>
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
