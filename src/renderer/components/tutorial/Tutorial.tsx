import * as React from 'react';
import { Col } from 'antd';
import classnames from 'classnames';

// type declaration
import { TutorialProps, TutorialState } from './tutorialDec';

// sass
import './tutorial.scss';

export default class Tutorial extends React.Component<TutorialProps, TutorialState> {
	constructor(props: TutorialProps) {
		super(props);
	}

	render() {
		const { expand } = this.props;

		return (
			<Col
				span={19}
				className={
					classnames('tutorial right-container', {
						'main-grow': !expand
					})
				}
			>
				教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程
				教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程
				教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程
				教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程
				教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程教程
			</Col>
		);
	}
}
