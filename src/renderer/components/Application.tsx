import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { Row, Col } from 'antd';
import 'antd/dist/antd.min.css';

import SidebarContainer from '../containers/SidebarContainer';
import MainContainer from '../containers/MainContainer';
import './overwrite.scss';

const Application = () => (
	<div>
		<Row>
			<SidebarContainer />
			<MainContainer />
		</Row>
	</div>
);

export default hot(Application);
