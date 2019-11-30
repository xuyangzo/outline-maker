import { RouteComponentProps, Route } from 'react-router-dom';

interface MatchParams {
	id: string;
}

export interface Character {
	id: number;
	name: string;
	created?: boolean;
}

export interface Timeline {
	time: string;

}

export interface MainProps extends RouteComponentProps<MatchParams> {
	expand: boolean;
	updateMain: boolean;

	refreshSidebar: () => void;
	refreshMain: () => void;
	cancelRefreshMain: () => void;
}

export interface MainState {
	id: number;
	title: string;
	description: string;
	characters: Character[];
}

export interface CharacterDataValue {
	id: number;
	outline_id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}