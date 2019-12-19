import { RouteComponentProps } from 'react-router-dom';

export interface NovelHeaderProps extends RouteComponentProps {
  createCharacter: boolean;
  createOutline: boolean;
  id: string;

  refreshCharacter: (id: string) => void;
  refreshOutline: (id: string) => void;
  cancelCreateCharacter: () => void;
  cancelCreateOutline: () => void;
}

export interface NovelHeaderState {
  id: string;
  characterVisible: boolean;
  outlineVisible: boolean;
}
