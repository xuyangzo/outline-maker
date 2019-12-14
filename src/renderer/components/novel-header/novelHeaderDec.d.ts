import { RouteComponentProps } from 'react-router-dom';

export interface NovelHeaderProps extends RouteComponentProps {
  refreshCharacter: (id: string) => void;
}

export interface NovelHeaderState {
  characterVisible: boolean;
  id: string;
}
