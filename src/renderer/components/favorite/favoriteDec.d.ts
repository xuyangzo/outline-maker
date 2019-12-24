import { RouteComponentProps } from 'react-router-dom';
import { Outline } from '../sidebar/sidebarDec';

// favorite templates for database popping
export interface FavoriteDataValue {
  id: number;
  novel_id: number;
  outline_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteProps extends RouteComponentProps {
  expand: boolean;

  refreshSidebar: () => void;
}

export interface FavoriteState {
  outlines: Outline[];
  confirmVisible: boolean;
  selected: number;
  shouldRender: boolean;
}
