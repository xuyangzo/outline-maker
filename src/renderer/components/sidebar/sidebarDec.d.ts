import { RouteComponentProps } from 'react-router-dom';

export interface Outline {
	id: number;
	title: string;
}

export interface OutlineDataValue {
	id: number;
	title: string;
	description: string;
	category_id: number;
	category_title: string;
	fav: number;
	deleted: number;
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
	outlines: Array<Outline>;
	selected: string[];
}

export interface SidebarTrashProps {

}

export interface SidebarTrashState {

}