import * as React from 'react';
import { PageHeader, Select, Switch } from 'antd';
const { Option } = Select;

// type decalration
import { ToolbarProps } from './toolbarDec';

// sass
import './toolbar.scss';

const Toolbar = (props: ToolbarProps) => {
	const { onTogglePlus, onChangeScaling, scaling } = props;

	return (
		<PageHeader
			title=""
			backIcon={false}
			extra={[
				<React.Fragment key="hide">
					显示+号：<Switch defaultChecked onChange={onTogglePlus} style={{ marginRight: '10px' }} />
				</React.Fragment>,
				<React.Fragment key="scaling">
					<span style={{ marginLeft: 10 }}>页面缩放：</span>
					<Select value={scaling.toString()} style={{ width: 82 }} onChange={onChangeScaling}>
						<Option value="0.25">25%</Option>
						<Option value="0.5">50%</Option>
						<Option value="0.75">75%</Option>
						<Option value="1">100%</Option>
						<Option value="1.25">125%</Option>
						<Option value="1.5">150%</Option>
						<Option value="1.75">175%</Option>
						<Option value="2">200%</Option>
					</Select>
				</React.Fragment>
			]}
			className="main-toolbar"
		/>
	);
};

export default Toolbar;
