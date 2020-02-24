import { RouteComponentProps } from 'react-router-dom';

export interface TrashDataValue {
	novels: number[];
	outlines: number[];
	characters: number[];
	locations: number[];
	inventories: number[];
}

export interface TrashProps extends RouteComponentProps {
	expand: boolean;

	refreshSidebar: () => void;
}

export interface TrashState {
	novels: number[];
	outlines: number[];
	characters: number[];
	locations: number[];
	inventories: number[];
	shouldRender: boolean;
	batchDelete: boolean;
	showClearModal: boolean;
}
