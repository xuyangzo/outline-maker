import { hot } from 'react-hot-loader/root';
import * as React from 'react';

// react router
import {
	HashRouter as Router,
	Switch,
	Route
} from 'react-router-dom';

// ant design
import { Row } from 'antd';
import 'antd/dist/antd.min.css';

// components
import SidebarContainer from '../containers/SidebarContainer';
import MainContainer from '../containers/MainContainer';
import ModalContainer from '../containers/ModalContainer';
import TutorialContainer from '../containers/TutorialContainer';
import TrashContainer from '../containers/TrashContainer';
import FavoriteContainer from '../containers/FavoriteContainer';

// sass
import './overwrite.scss';

const Application = () => (
	<div>
		<Row>
			<Router>
				<ModalContainer />
				<SidebarContainer />
				<Switch>
					<Route path="/" exact><TutorialContainer /></Route>
					<Route path="/outline/:id" exact><MainContainer /></Route>
					<Route path="/trash" exact><TrashContainer /></Route>
					<Route path="/favorite" exact><FavoriteContainer /></Route>
				</Switch>
			</Router>
		</Row>
	</div>
);

export default hot(Application);
