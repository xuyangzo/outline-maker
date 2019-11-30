import * as React from 'react';
import { Col, message as Message } from 'antd';
import classnames from 'classnames';

// custom components
import MainHeader from '../main-header/MainHeader';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { OutlineDataValue } from '../sidebar/sidebarDec';
import { MainProps, MainState } from './mainDec';
import { DatabaseError } from 'sequelize';

// sequelize modals
import Outlines from '../../../db/models/Outlines';

// sass
import './main.scss';

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
			.catch((err: DatabaseError) => {
				Message.error(err.message);
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
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand, refreshSidebar, updateMain, refreshMain } = this.props;
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
				<MainHeader
					title={title}
					description={description}
					refresh={refreshSidebar}
					refreshMain={refreshMain}
				/>
			</Col>
		);
	}
}

export default withRouter(Main);
