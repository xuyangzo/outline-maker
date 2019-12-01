import { RouteComponentProps } from 'react-router-dom';

export interface MainHeaderProps extends RouteComponentProps {
  title: string;
  description: string;

  refresh: () => void;
  refreshMain: () => void;
  createCharacterLocally: (name: string) => void;
  createTimelineLocally: (time: string) => void;
  onSave: () => void;
}

export interface MainHeaderState {
  confirmVisible: boolean;
  characterVisible: boolean;
  timelineVisible: boolean;
  introVisible: boolean;
  isFav: boolean;
}
