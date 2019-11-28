import * as React from 'react';
import { MainProps, MainState } from './mainDec';
import { Col } from 'antd';
import classnames from 'classnames';

import MainHeader from '../main-header/MainHeader';
import './main.scss';

// const IconFont = Icon.createFromIconfontCN({
// 	scriptUrl: '//at.alicdn.com/t/font_1531781_n3f5v9yel4c.js',
// });

export default class Main extends React.Component<MainProps, MainState> {
	constructor(props: MainProps) {
		super(props);
	}

	render() {
		const { expand } = this.props;

		return (
			<Col
				span={19}
				className={
					classnames('main', {
						'main-grow': !expand
					})
				}
			>
				<MainHeader />
			</Col>
		);
	}
}
