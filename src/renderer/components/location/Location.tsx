import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// custom components

// type declaration
import { LocationProps, LocationState, Location as LocationDec } from './locationDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getLocation } from '../../../db/operations/location-ops';

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
			.then(({ dataValues }: { dataValues: LocationDec }) => {
				const { name, image, intro, texture, location, controller } = dataValues;
				this.setState({ name, image, intro, texture, location, controller });
			})
			.catch((err: DatabaseError) => {
				Message.error(err);
			});
	}

	render() {
		const { expand } = this.props;
		const { name, novel_id, image, intro, texture, location, controller } = this.state;

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
					onBack={() => { this.props.history.push(`/novel/${novel_id}`); }}
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
							<Col span={3} style={{ width: '50px' }}>首领：</Col>
							<Col span={12}>
								{controller ? controller : '暂无'}
							</Col>
						</Row>
						<Row className="location-section">
							<Col span={3} style={{ width: '50px' }}>介绍：</Col>
							<Col span={12}>
								{intro ? intro : '暂无'}
							</Col>
						</Row>
						<Row className="location-section">
							<Col span={3} style={{ width: '50px' }}>外观：</Col>
							<Col span={12}>
								{texture ? texture : '暂无'}
							</Col>
						</Row>
						<Row className="location-section">
							<Col span={3} style={{ width: '50px' }}>位置：</Col>
							<Col span={12}>
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
