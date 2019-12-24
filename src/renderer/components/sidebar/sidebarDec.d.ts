import { RouteComponentProps } from 'react-router-dom';

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

export interface NovelDataValue {
	id: number;
	name: string;
	description: string;
	categories: string;
}

export interface Novel {
	id: number;
	name: string;
	description: string;
	categories: string;
}

export interface CreateNovelModalTemplate {
	name: string;
	description?: string;
}

interface MatchParams {
	id: string;
}

export interface SidebarProps extends RouteComponentProps<MatchParams> {
	expand: boolean;
	refresh: boolean;

	shrinkSidebar: () => void;
	growSidebar: () => void;
	stopRefreshSidebar: () => void;
	createOutline: () => void;
}

export interface SidebarState {
	novels: Array<Novel>;
	selected: string[];
	showModal: boolean;
	createdName: string;
	createdDescription: string;
}