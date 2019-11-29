import { RouteComponentProps, Route } from 'react-router-dom';

interface MatchParams {
	id: string;
}

export interface MainProps extends RouteComponentProps<MatchParams> {
	expand: boolean;

	refreshSidebar: () => void;
}

export interface MainState {
	id: number;
	title: string;
	description: string;
}
