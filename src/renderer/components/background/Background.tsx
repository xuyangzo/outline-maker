import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Tooltip } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { BackgroundProps, BackgroundState, BackgroundDec, BackgroundDataValue } from './backgroundDec';

// database operations
import { getBackgroundsGivenNovel } from '../../../db/operations/background-ops';

// utils
import { backgroundIllustrations } from '../../utils/constants';

// sass
import './background.scss';

class Background extends React.Component<BackgroundProps, BackgroundState> {
	constructor(props: BackgroundProps) {
		super(props);
		this.state = {
			novel_id: this.props.match.params.id,
			backgrounds: []
		};
	}

	componentDidMount = () => {
		this.setBackground();
	}

	setBackground = () => {
		getBackgroundsGivenNovel(this.state.novel_id)
			.then((backgrounds: BackgroundDataValue[]) => {
				this.setState({ backgrounds });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand } = this.props;
		const { backgrounds } = this.state;

		let worldview = '还没有世界观...';
		let levelSystem = '还没有等级体系...';
		let currencySystem = '还没有货币体系...';
		// filter worldview, level system, currency system out of arrays
		const leftBackgrounds: BackgroundDec[] = backgrounds.filter((background: BackgroundDec) => {
			if (background.title === '世界观') {
				worldview = background.content;
				return false;
			}
			if (background.title === '等级体系') {
				levelSystem = background.content;
				return false;
			}
			if (background.title === '货币体系') {
				currencySystem = background.content;
				return false;
			}
			return true;
		});

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
				<div className="background-content">
					<Row className="background-section">
						<h2 className="background-name">{name}</h2>
					</Row>
					<Row className="background-section">
						<Col span={3} offset={2}>
							世界观
							<Tooltip
								placement="rightTop"
								title={backgroundIllustrations.worldview}
							>
								<Icon type="question-circle" className="question-mark" />
							</Tooltip>
						</Col>
						<Col span={19}>
							{worldview}
						</Col>
					</Row>
					<Row className="background-section">
						<Col span={3} offset={2}>
							等级体系
							<Tooltip
								placement="rightTop"
								title={backgroundIllustrations.levelSystem}
							>
								<Icon type="question-circle" className="question-mark" />
							</Tooltip>
						</Col>
						<Col span={19}>
							{levelSystem}
						</Col>
					</Row>
					<Row className="background-section">
						<Col span={3} offset={2}>
							货币体系
							<Tooltip
								placement="rightTop"
								title={backgroundIllustrations.currencySystem}
							>
								<Icon type="question-circle" className="question-mark" />
							</Tooltip>
						</Col>
						<Col span={19}>
							{currencySystem}
						</Col>
					</Row>
					{
						leftBackgrounds.map((background: BackgroundDec) => (
							<Row className="background-section" key={background.title}>
								<Col span={3} offset={2}>{background.title}：</Col>
								<Col span={19}>
									{background.content}
								</Col>
							</Row>
						))
					}
				</div>
			</Col>
		);
	}
}

export default withRouter(Background);
