import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Upload, Input, Tooltip } from 'antd';
import classnames from 'classnames';
const { TextArea } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// file stream
const fs = require('fs');

// type declaration
import { LocationProps, LocationState, Location as LocationDec } from './locationDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getLocation, updateLocation } from '../../../db/operations/location-ops';

// utils
import { ctrlsPress } from '../../utils/utils';
import { locationIllustrations } from '../../utils/constants';

// sass
import './location.scss';

class LocationEdit extends React.Component<LocationProps, LocationState> {
	constructor(props: LocationProps) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			novel_id: this.props.match.params.novel_id,
			name: '',
			image: '',
			intro: '',
			texture: '',
			location: '',
			controller: ''
		};
	}

	componentDidMount = () => {
		// add event listener for save shortcut
		document.addEventListener('keydown', this.onSavePress);

		this.setLocation();
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

	// when textarea changes
	onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ [e.target.name]: e.target.value });
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

	// save changes
	onSave = () => {
		const { id, name, image, intro, texture, location, controller } = this.state;

		// filter invalid input
		const props: { [key: string]: string | number } = {
			name, image, intro, texture, location, controller
		};

		updateLocation(id, props)
			.then(() => {
				Message.success('保存成功！');
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	setLocation = () => {
		getLocation(this.state.id)
			.then(({ dataValues }: { dataValues: LocationDec }) => {
				const { name, image, intro, texture, location, controller } = dataValues;
				/**
				 * need to filter empty input
				 * in order not to convert controlled components to uncontrolled components
				 * uncontrolled input components = value is undefined/null
				 */
				this.setState({
					name, image,
					intro: intro ? intro : '',
					texture: texture ? texture : '',
					location: location ? location : '',
					controller: controller ? controller : ''
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	render() {
		const { expand } = this.props;
		const { name, image, intro, texture, location, controller } = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('location', {
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
				<div className="location-content">
					<Row className="location-section">
						<input
							type="text"
							value={name}
							name="name"
							onChange={this.onInputChange}
							placeholder="势力名称"
							className="location-input location-name-input medium-input"
						/>
						<Upload
							name="profile-image-uploader"
							customRequest={this.onImageUpload}
							showUploadList={false}
							beforeUpload={this.onImageUpload}
						>
							<Button style={{ width: 200, marginTop: 20 }}>
								<Icon type="upload" /> 选择图片
							</Button>
						</Upload>
						{
							image && (
								<img src={image} alt="profile image" className="profile-image" />
							)
						}
						<Row className="location-section">
							<Col span={3} style={{ width: '60px' }}>首领：</Col>
							<Col span={18}>
								<input
									type="text"
									value={controller}
									name="controller"
									onChange={this.onInputChange}
									placeholder="统治者"
									className="location-input medium-input"
								/>
							</Col>
						</Row>
						<Row className="location-section">
							<Col span={3} style={{ width: '60px' }}>
								介绍
								<Tooltip
									placement="rightTop"
									title={locationIllustrations.intro}
								>
									<Icon type="question-circle" className="question-mark" />
								</Tooltip>
							</Col>
							<Col span={18}>
								<TextArea
									rows={6}
									placeholder="势力的介绍"
									value={intro}
									onChange={this.onTextAreaChange}
									name="intro"
								/>
							</Col>
						</Row>
						<Row className="location-section">
							<Col span={3} style={{ width: '60px' }}>
								外观
								<Tooltip
									placement="rightTop"
									title={locationIllustrations.texture}
								>
									<Icon type="question-circle" className="question-mark" />
								</Tooltip>
							</Col>
							<Col span={18}>
								<TextArea
									rows={6}
									placeholder="外形（建筑风格、景物等等）"
									value={texture}
									onChange={this.onTextAreaChange}
									name="texture"
								/>
							</Col>
						</Row>
						<Row className="location-section">
							<Col span={3} style={{ width: '60px' }}>位置：</Col>
							<Col span={18}>
								<TextArea
									rows={6}
									placeholder="地理位置"
									value={location}
									onChange={this.onTextAreaChange}
									name="location"
								/>
							</Col>
						</Row>
					</Row>
				</div>
			</Col>
		);
	}
}

export default withRouter(LocationEdit);
