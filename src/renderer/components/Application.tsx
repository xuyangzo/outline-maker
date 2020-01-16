import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import classnames from 'classnames';

// react router
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

// ant design
import { Row } from 'antd';
import 'antd/dist/antd.min.css';

// components
import SidebarContainer from '../containers/SidebarContainer';
import MainContainer from '../containers/MainContainer';
import TutorialContainer from '../containers/TutorialContainer';
import TrashContainer from '../containers/TrashContainer';
import FavoriteContainer from '../containers/FavoriteContainer';
import NovelContainer from '../containers/NovelContainer';
import {
	NovelCharacterContainer, NovelCharacterEditContainer,
	CharacterContainer, CharacterEditContainer
} from '../containers/CharacterContainer';
import {
	NovelLocationContainer, NovelLocationEditContainer,
	LocationContainer, LocationEditContainer
} from '../containers/LocationContainer';
import { BackgroundContainer, BackgroundEditContainer } from '../containers/BackgroundContainer';
import { NovelOutlineContainer, NovelOutlineEditContainer } from '../containers/OutlineContainer';

// set database model relations
require('../../db/relations');

// sass
import './overwrite.scss';
import './app.scss';

// image
import icon from '../../public/icons/png/icon-512@2x.png';

const Application = () => {
	const [shouldAnimate, setAnimate] = React.useState<boolean>(false);

	return (
		<div>
			<div
				className={
					classnames('open-theme', {
						'open-theme-animation': shouldAnimate
					})
				}
			>
				<img
					src={icon}
					alt="app-icon"
					className="app-icon"
					onLoad={() => setAnimate(true)}
				/>&nbsp;
				<span className="app-name">朝思</span>
			</div>
			<Row>
				<Router>
					<SidebarContainer />
					<Switch>
						<Route path="/" exact><TutorialContainer /></Route>
						<Route path="/novel/:id" exact><NovelContainer /></Route>
						<Route path="/background/:id" exact><BackgroundContainer /></Route>
						<Route path="/background/:id/edit" exact><BackgroundEditContainer /></Route>
						<Route path="/characters/:novel_id" exact><NovelCharacterContainer /></Route>
						<Route path="/characters/:novel_id/edit" exact><NovelCharacterEditContainer /></Route>
						<Route path="/character/:novel_id/:id" exact><CharacterContainer /></Route>
						<Route path="/character/:novel_id/:id/edit" exact><CharacterEditContainer /></Route>
						<Route path="/locations/:novel_id" exact><NovelLocationContainer /></Route>
						<Route path="/locations/:novel_id/edit" exact><NovelLocationEditContainer /></Route>
						<Route path="/location/:novel_id/:id" exact><LocationContainer /></Route>
						<Route path="/location/:novel_id/:id/edit" exact><LocationEditContainer /></Route>
						<Route path="/outlines/:novel_id" exact><NovelOutlineContainer /></Route>
						<Route path="/outlines/:novel_id/edit" exact><NovelOutlineEditContainer /></Route>
						<Route path="/outline/:novel_id/:id" exact><MainContainer /></Route>
						<Route path="/trash" exact><TrashContainer /></Route>
						<Route path="/favorite" exact><FavoriteContainer /></Route>
					</Switch>
				</Router>
			</Row>
		</div>
	);
};

export default hot(Application);
