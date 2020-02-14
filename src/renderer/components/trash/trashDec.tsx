import { RouteComponentProps } from 'react-router-dom';

export interface TrashDataValue {
	novels: number[];
	outlines: number[];
	characters: number[];
	locations: number[];
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
	shouldRender: boolean;
	batchDelete: boolean;
	showClearModal: boolean;
}
