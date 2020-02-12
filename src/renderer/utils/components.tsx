import * as React from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';

interface PropertyProps {
	tip: string;
	fieldName: string;
	text: string | undefined;
}

// single character page property display
export const Property = (props: PropertyProps) => {
	const { tip, text, fieldName } = props;

	if (tip.length) {
		return (
			<Row className="character-section">
				<Col span={4} style={{ width: '60px' }}>
					{fieldName}
					<Tooltip
						placement="rightTop"
						title={tip}
					>
						<Icon type="question-circle" className="question-mark" />
					</Tooltip>
				</Col>
				<Col span={16} className="wrap">
					{text ? text : '暂无'}
				</Col>
			</Row>
		);
	}

	return (
		<Row className="character-section">
			<Col span={4} style={{ width: '60px' }}>{fieldName}：</Col>
			<Col span={16} className="wrap">
				{text ? text : '暂无'}
			</Col>
		</Row>
	);
};
