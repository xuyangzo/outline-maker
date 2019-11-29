import { RouteComponentProps } from 'react-router-dom';
import { Outline } from '../sidebar/sidebarDec';

export interface FavoriteDataValue {
  id: number;
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
}
