import { RouteComponentProps } from 'react-router-dom';
import { Character } from '../character/characterDec';
import { Outline } from '../sidebar/sidebarDec';

export interface TrashDataValue {
	id: number;
	novel_id?: number;
	outline_id?: number;
	character_id?: number;
	loc_id?: number;
	createdAt: string;
	updatedAt: string;
}

export interface TrashProps extends RouteComponentProps {
	expand: boolean;

	refreshSidebar: () => void;
}

export interface TrashState {
	outlines: Outline[];
	characters: Character[];
	confirmVisible: boolean;
	backVisible: boolean;
	selected: number;
	shouldRender: boolean;
}
