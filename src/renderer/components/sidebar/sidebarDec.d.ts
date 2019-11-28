export interface Outline {
	id: number;
	title: string;
}

export interface OutlineDataValue {
	id: number;
	title: string;
	category_id: number;
	category_title: string;
	fav: number;
	deleted: number;
}

export interface SidebarProps {
	expand: boolean;
	refresh: boolean;

	shrinkSidebar: () => void;
	growSidebar: () => void;
	stopRefreshSidebar: () => void;
	createOutline: () => void;
}

export interface SidebarState {
	outlines: Array<Outline>;
}

export interface SidebarTrashProps {

}

export interface SidebarTrashState {

}