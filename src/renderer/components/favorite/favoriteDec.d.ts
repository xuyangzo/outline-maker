import { RouteComponentProps } from 'react-router-dom';

// favorite templates for database popping
export interface FavoriteDataValue {
  id: number;
  novel_id: number;
  title: string;
  description: string;
}

export interface FavoriteProps extends RouteComponentProps {
  expand: boolean;

  refreshSidebar: () => void;
}

export interface FavoriteState {
  outlines: FavoriteDataValue[];
  confirmVisible: boolean;
  selected: number;
  shouldRender: boolean;
}
