import { RouteComponentProps } from 'react-router-dom';
import { number } from 'prop-types';

interface MatchParams {
	novel_id: string;
	id: string;
}

export interface MainCharacterDataValue {
	id: number;
	name: string;
	color: string;
}

export interface MainCharacter extends MainCharacterDataValue {
	outline_id?: string;
	image?: string;
	gender?: string;
	created?: boolean;
	updated?: boolean;
	existing?: boolean;
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

export interface Outline {
	id: number;
	novel_id: number;
	title: string;
	deleted?: number;
	description?: string;
}

export interface OutlineDataValue {
	id: number;
	title: string;
	description: string;
	novel_id: number;
	scaling: string;
	fav: number;
	deleted: number;
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

export interface OutlineShortDataValue {
	id: number;
	title: string;
	description: string;
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
	id: string;
	title: string;
	description: string;
	characters: MainCharacter[];
	timelines: Timeline[];
	contents: OutlineContent;
	changed: boolean;
	shouldScroll: boolean;
	shouldRender: boolean;
	scaling: string;
	showPlusIcons: boolean;
	colors: string[];
	deletedCharacters: number[];
	deletedTimelines: number[];
}