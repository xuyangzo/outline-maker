import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Tooltip } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { LocationProps, LocationState, LocationDataValue } from './locationDec';

// database operations
import { getLocation } from '../../../db/operations/location-ops';

// utils
import { locationIllustrations } from '../../utils/constants';

// sass
import './location.scss';

class Location extends React.Component<LocationProps, LocationState> {
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
		this.setLocation();
	}

	setLocation = () => {
		getLocation(this.state.id)
			.then((location: LocationDataValue) => {
				this.setState({ ...location });
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
				<div className="location-content">
					<Row className="location-section">
						<h2 className="location-name">{name}</h2>
						{
							image && (
								<img src={image} alt="profile image" className="profile-image" />
							)
						}
						<Row className="location-section">
							<Col span={3} style={{ width: '60px' }}>首领：</Col>
							<Col span={18}>
								{controller ? controller : '暂无'}
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
							<Col span={18} className="multiline-text">
								{intro ? intro : '暂无'}
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
							<Col span={18} className="multiline-text">
								{texture ? texture : '暂无'}
							</Col>
						</Row>
						<Row className="location-section">
							<Col span={3} style={{ width: '60px' }}>位置：</Col>
							<Col span={18} className="multiline-text">
								{location ? location : '暂无'}
							</Col>
						</Row>
					</Row>
				</div>
			</Col>
		);
	}
}

export default withRouter(Location);
