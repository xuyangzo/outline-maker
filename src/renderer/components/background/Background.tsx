import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Tooltip } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { BackgroundProps, BackgroundState } from './backgroundDec';
import { DatabaseError } from 'sequelize';

// database operations

// sass
import './background.scss';

class Background extends React.Component<BackgroundProps, BackgroundState> {
	constructor(props: BackgroundProps) {
		super(props);
		this.state = {
			novel_id: this.props.match.params.novel_id
		};
	}

	componentDidMount = () => {
		this.setBackground();
	}

	setBackground = () => {

	}

	render() {
		const { expand } = this.props;
		const { } = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('background-page', {
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
				<div className="background-content">
					<Row className="background-section">
						<Col span={14} style={{ paddingLeft: '40px' }}>
							<Row className="background-section">
								<h2 className="background-name">{name}</h2>
							</Row>
							<Row className="background-section">
								<Col span={4} style={{ width: '90px' }}>
									世界观
									<Tooltip
										placement="rightTop"
										title="test"
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={8}>
									nb
								</Col>
							</Row>
							<Row className="background-section">
								<Col span={4} style={{ width: '90px' }}>
									等级体系
									<Tooltip
										placement="rightTop"
										title="test"
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={8}>
									nb
								</Col>
							</Row>
							<Row className="background-section">
								<Col span={4} style={{ width: '90px' }}>
									货币体系
									<Tooltip
										placement="rightTop"
										title="test"
									>
										<Icon type="question-circle" className="question-mark" />
									</Tooltip>
								</Col>
								<Col span={8}>
									nb
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</Col>
		);
	}
}

export default withRouter(Background);
