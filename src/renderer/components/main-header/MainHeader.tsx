import * as React from 'react';
import { MainHeaderProps, MainHeaderState } from './mainHeaderDec';
import { Icon, Button, PageHeader } from 'antd';
import classnames from 'classnames';

// const IconFont = Icon.createFromIconfontCN({
// 	scriptUrl: '//at.alicdn.com/t/font_1531781_n3f5v9yel4c.js',
// });

export default class Main extends React.Component<MainHeaderProps, MainHeaderState> {
	constructor(props: MainHeaderProps) {
		super(props);
	}

	render() {
		return (
			<PageHeader
				title="Title"
				subTitle="This is not subtitle"
				backIcon={false}
				extra={[
					<Button type="primary" key="add-person" ghost><Icon type="user-add" />添加人物</Button>,
					<Button type="danger" key="delete" ghost>删除大纲</Button>
				]}
			/>
		);
	}
}
