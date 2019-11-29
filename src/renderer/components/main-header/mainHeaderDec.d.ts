import { RouteComponentProps } from 'react-router-dom';

export interface MainHeaderProps extends RouteComponentProps {
  title: string;
  description: string;

  refresh: () => void;
}

export interface MainHeaderState {
  confirmVisible: boolean;
  isFav: boolean;
}
