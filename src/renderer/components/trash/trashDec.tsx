import { RouteComponentProps } from 'react-router-dom';
import { Outline } from '../sidebar/sidebarDec';

export interface TrashDataValue {
	id: number;
	outline_id: number;
	createdAt: string;
	updatedAt: string;
}

export interface TrashProps extends RouteComponentProps {
	expand: boolean;

	refreshSidebar: () => void;
}

export interface TrashState {
	outlines: Outline[];
	confirmVisible: boolean;
	backVisible: boolean;
	selected: number;
}
