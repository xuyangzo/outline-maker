import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Select, Upload, Tooltip, Input } from 'antd';
import classnames from 'classnames';
const { Option } = Select;
const { TextArea } = Input;

// file stream
const fs = require('fs');

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { CharacterProps, CharacterEditState, CharacterDataValue } from './characterDec';

// database operations
import { getCharacter, updateCharacter } from '../../../db/operations/character-ops';

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
			identity: '',
			appearance: '',
			characteristics: '',
			experience: '',
			note: ''
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

	onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	// when select gender
	onSelectGender = (value: string) => {
		this.setState({ gender: parseInt(value, 10) });
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
	onSave = () => {
		const {
			id, name, image, age, nickname, gender, height, note,
			identity, appearance, characteristics, experience
		} = this.state;

		// filter invalid input
		const props: { [key: string]: string | number } = {
			name, image, age, nickname, gender, height, note,
			identity, appearance, characteristics, experience
		};

		updateCharacter(id, props)
			.then(() => {
				// alert success
				Message.success('保存成功！');
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// set the character's info
	setCharacter = () => {
		getCharacter(this.state.id)
			.then((character: CharacterDataValue) => {
				this.setState({ ...character });
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	render() {
		const { expand } = this.props;
		const {
			name, image, age, nickname, gender, note,
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
					onBack={() => { this.props.history.goBack(); }}
					className="main-header"
					extra={[
						<Button
							key="quit"
							type="danger"
							ghost
							onClick={() => { this.props.history.goBack(); }}
						>
							<Icon type="rollback" />退出编辑
						</Button>,
						<Button
							key="edit"
							type="danger"
							className="green-button"
							onClick={this.onSave}
							ghost
						>
							<Icon type="edit" />保存编辑
						</Button>
					]}
				/>
				<div className="character-content">
					<Row className="character-section">
						<Col span={9} style={{ paddingTop: 25 }}>
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
						<Col span={15} className="character-edit-content">
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
									<TextArea
										rows={6}
										placeholder="身份"
										value={identity}
										name="identity"
										onChange={this.onTextAreaChange}
									/>
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
									<TextArea
										rows={6}
										placeholder="外貌"
										value={appearance}
										name="appearance"
										onChange={this.onTextAreaChange}
									/>
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
									<TextArea
										rows={6}
										placeholder="性格"
										value={characteristics}
										name="characteristics"
										onChange={this.onTextAreaChange}
									/>
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
									<TextArea
										rows={6}
										placeholder="经历"
										value={experience}
										name="experience"
										onChange={this.onTextAreaChange}
									/>
								</Col>
							</Row>
							<Row className="character-section">
								<Col span={4} style={{ width: '60px' }}>
									备注
									<Tooltip
										placement="rightTop"
										title={characterIllustrations.experience}
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={20} className="numbered-text">
									<TextArea
										rows={6}
										placeholder="备注"
										value={note}
										name="note"
										onChange={this.onTextAreaChange}
									/>
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
