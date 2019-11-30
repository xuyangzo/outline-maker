import { RouteComponentProps } from 'react-router-dom';

export interface MainHeaderProps extends RouteComponentProps {
  title: string;
  description: string;

  refresh: () => void;
  refreshMain: () => void;
}

export interface MainHeaderState {
  confirmVisible: boolean;
  characterVisible: boolean;
  isFav: boolean;
}
