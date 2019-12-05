import { RouteComponentProps, Route } from 'react-router-dom';
import { number } from 'prop-types';

interface MatchParams {
	id: string;
}

export interface Character {
	id: number;
	name: string;
	color: string;
	created?: boolean;
	updated?: boolean;
}

export interface CharacterDataValue {
	id: number;
	outline_id: number;
	name: string;
	color: string;
	createdAt: string;
	updatedAt: string;
}

export interface Timeline {
	id: number;
	time: string;
	created?: boolean;
	updated?: boolean;
}

export interface TimelineDataValue {
	id: number;
	outline_id: number;
	time: string;
	createdAt: string;
	updatedAt: string;
}

export interface OutlineDetailDataValue {
	id: number;
	outline_id: number;
	character_id: number;
	timeline_id: number;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export type ContentCard = {
	id?: number,
	content: string,
	created?: boolean,
	updated?: boolean
}

export type OutlineContent = Map<number, Map<number, ContentCard>>;

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
	contents: OutlineContent;
	changed: boolean;
	shouldScroll: boolean;
	scaling: string;
	showPlusIcons: boolean;
	colors: string[];
	deletedCharacters: number[];
}