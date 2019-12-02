import * as React from 'react';
import { PageHeader, Select, Tooltip, Switch } from 'antd';
const { Option } = Select;

// type decalration
import { ToolbarProps, ToolbarState } from './toolbarDec';

// sass
import './toolbar.scss';

class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
	constructor(props: ToolbarProps) {
		super(props);
		this.state = {
		};
	}

	render() {
		const { onTogglePlus, onChangeScaling } = this.props;

		return (
			<PageHeader
				title=""
				backIcon={false}
				extra={[
					<Tooltip key="hide" title="显示+号" placement="top">
						<Switch defaultChecked onChange={onTogglePlus} style={{ marginRight: '10px' }} />
					</Tooltip>,
					<Tooltip key="scaling" title="页面缩放" placement="top">
						<Select value={this.props.scaling.toString()} style={{ width: 82 }} onChange={onChangeScaling}>
							<Option value="0.25">25%</Option>
							<Option value="0.5">50%</Option>
							<Option value="0.75">75%</Option>
							<Option value="1">100%</Option>
							<Option value="1.25">125%</Option>
							<Option value="1.5">150%</Option>
							<Option value="1.75">175%</Option>
							<Option value="2">200%</Option>
						</Select>
					</Tooltip>
				]}
				className="main-toolbar"
			/>
		);
	}
}

export default Toolbar;
