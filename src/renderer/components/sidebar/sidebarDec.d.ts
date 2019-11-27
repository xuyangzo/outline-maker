export interface SidebarProps {
	expand: boolean;

	shrinkSidebar: () => void;
	growSidebar: () => void;
}

export interface SidebarState {
	selected: string;
}
