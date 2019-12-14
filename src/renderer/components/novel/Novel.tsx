import * as React from 'react';
import { Col, message as Message } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// custom components
import NovelHeader from '../novel-header/NovelHeader';

// type declaration
import { NovelProps, NovelState } from './novelDec';
import { NovelDataValue } from '../sidebar/sidebarDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getNovelById } from '../../../db/operations/novel-ops';

// sass
import './novel.scss';

class Novel extends React.Component<NovelProps, NovelState> {
	constructor(props: NovelProps) {
		super(props);
		this.state = {
			name: '',
			description: '',
			categories: []
		};
	}

	componentDidMount = () => {
		const { id } = this.props.match.params;
		this.getNovelContent(id);
	}

	componentWillReceiveProps = (props: NovelProps) => {
		const { id } = props.match.params;
		this.getNovelContent(id);
	}

	// get novel content
	getNovelContent = (id: string) => {
		getNovelById(id)
			.then(({ dataValues }: { dataValues: NovelDataValue }) => {
				this.setState({
					name: dataValues.name,
					description: dataValues.description,
					categories: dataValues.categories.split(',')
				});
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand } = this.props;
		const { name, description } = this.state;

		return (
			<Col
				span={19}
				className={
					classnames('novel', {
						'main-grow': !expand
					})
				}
			>
				<NovelHeader />
				<div className="novel-content">
					<h2>{name}</h2>
					<p className="novel-description">{description}</p>
				</div>
			</Col>
		);
	}
}

export default withRouter(Novel);
