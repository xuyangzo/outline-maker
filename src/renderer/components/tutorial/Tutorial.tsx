import * as React from 'react';
import { TutorialProps, TutorialState } from './tutorialDec';
import { Col } from 'antd';
import classnames from 'classnames';

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
					classnames('tutorial', {
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
