import { RouteComponentProps } from 'react-router-dom';

export interface NovelHeaderProps extends RouteComponentProps {
  createCharacter: boolean;

  refreshCharacter: (id: string) => void;
  cancelCreateCharacter: () => void;
}

export interface NovelHeaderState {
  characterVisible: boolean;
  id: string;
}
