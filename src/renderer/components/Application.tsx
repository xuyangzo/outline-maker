import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { Row } from 'antd';
import 'antd/dist/antd.min.css';

import SidebarContainer from '../containers/SidebarContainer';
import MainContainer from '../containers/MainContainer';
import ModalContainer from '../containers/ModalContainer';
import './overwrite.scss';

require('../../db/relations');

const Application = () => (
	<div>
		<Row>
			<SidebarContainer />
			<MainContainer />
			<ModalContainer />
		</Row>
	</div>
);

export default hot(Application);
