import { RouteComponentProps } from 'react-router-dom';
import { CharacterShortDataValue } from '../character/characterDec';
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
	outlines: number[];
	characters: number[];
	locations: number[];
	shouldRender: boolean;
}
