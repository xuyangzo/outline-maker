import * as React from 'react';
import { Col, message as Message, Card, Row, Collapse, Icon, PageHeader, Button } from 'antd';
import classnames from 'classnames';
const { Panel } = Collapse;

// enable history
import { withRouter } from 'react-router-dom';

// custom components

// type declaration
import { CharacterProps, CharacterState } from './characterDec';
import { DatabaseError } from 'sequelize';

// database operations

// sass
import './character.scss';

// image
import shadow from '../../../public/shadow-person.jpg';

class Character extends React.Component<CharacterProps, CharacterState> {
	constructor(props: CharacterProps) {
		super(props);
		this.state = {
		};
	}

	componentDidMount = () => {
		const { id } = this.props.match.params;
	}

	componentWillReceiveProps = (props: CharacterProps) => {
		const { id } = props.match.params;
	}

	render() {
		const { expand } = this.props;

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
						<Button key="edit" type="danger" className="orange-button" ghost>
							<Icon type="edit" />编辑小说
						</Button>
					]}
				/>
				<div className="character-content">
					sb
				</div>
			</Col>
		);
	}
}

export default withRouter(Character);
