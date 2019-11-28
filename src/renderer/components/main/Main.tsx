import * as React from 'react';
import { MainProps, MainState } from './mainDec';
import { OutlineDataValue } from '../sidebar/sidebarDec';
import { Col } from 'antd';
import classnames from 'classnames';

import MainHeader from '../main-header/MainHeader';
import { withRouter } from 'react-router-dom';
import './main.scss';

import Outlines from '../../../db/models/Outlines';

class Main extends React.Component<MainProps, MainState> {
	constructor(props: MainProps) {
		super(props);
		this.state = {
			id: -1,
			title: '标题',
			description: '描述...'
		};
	}

	componentWillReceiveProps = (props: MainProps) => {
		const { id } = props.match.params;
		Outlines
			.findOne({
				where: {
					id
				}
			})
			.then(({ dataValues }: { dataValues: OutlineDataValue }) => {
				const { id, title, description } = dataValues;
				this.setState({
					id,
					title,
					description
				});
			})
			.catch((err: any) => {

			});
	}

	componentDidMount = () => {
		const { id } = this.props.match.params;
		Outlines
			.findOne({
				where: {
					id
				}
			})
			.then(({ dataValues }: { dataValues: OutlineDataValue }) => {
				const { id, title, description } = dataValues;
				this.setState({
					id,
					title,
					description
				});
			})
			.catch((err: any) => {

			});
	}

	render() {
		const { expand } = this.props;
		const { title, description } = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('main', {
						'main-grow': !expand
					})
				}
			>
				<MainHeader title={title} description={description} />
			</Col>
		);
	}
}

export default withRouter(Main);
