import { RouteComponentProps } from 'react-router-dom';

export interface NovelSidebarDataValue {
	id: number;
	name: string;
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
	edited: boolean;

	shrinkSidebar: () => void;
	growSidebar: () => void;
	stopRefreshSidebar: () => void;
	createOutline: () => void;
	setOpen: () => void;
	setRedirect: (payload: string) => void;
}

export interface SidebarState {
	novels: NovelSidebarDataValue[];
	selected: string[];
	showModal: boolean;
	createdName: string;
	createdDescription: string;
	edited: boolean;
}