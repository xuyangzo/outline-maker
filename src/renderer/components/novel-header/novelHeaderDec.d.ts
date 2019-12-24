import { RouteComponentProps } from 'react-router-dom';

export interface NovelHeaderProps extends RouteComponentProps {
  createCharacter: boolean;
  createOutline: boolean;
  createLocation: boolean;
  id: string;

  refreshCharacter: (id: string) => void;
  refreshOutline: (id: string) => void;
  refreshLocation: (id: string) => void;
  refreshSidebar: () => void;
  cancelCreateCharacter: () => void;
  cancelCreateOutline: () => void;
  cancelCreateLocation: () => void;
}

export interface NovelHeaderState {
  id: string;
  characterVisible: boolean;
  outlineVisible: boolean;
  locationVisible: boolean;
  deleteNovelVisible: boolean;
}
