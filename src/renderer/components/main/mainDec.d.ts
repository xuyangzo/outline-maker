import { RouteComponentProps, Route } from 'react-router-dom';

interface MatchParams {
	id: string;
}

export interface Character {
	id: number;
	name: string;
	created?: boolean;
	updated?: boolean;
}

export interface CharacterDataValue {
	id: number;
	outline_id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface Timeline {
	id: number;
	time: string;
}

export interface TimelineDataValue {
	id: number;
	outline_id: number;
	time: string;
	createdAt: string;
	updatedAt: string;
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
	timelines: Timeline[];
}