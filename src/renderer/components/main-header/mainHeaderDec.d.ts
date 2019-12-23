import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  novel_id: string;
  id: string;
}

export interface MainHeaderProps extends RouteComponentProps<MatchParams> {
  title: string;
  description: string;

  refresh: () => void;
  refreshMain: () => void;
  createCharacterLocally: (name: string) => void;
  createTimelineLocally: (time: string) => void;
  onSave: (notUpdateState: boolean) => void;
}

export interface MainHeaderState {
  confirmVisible: boolean;
  characterVisible: boolean;
  timelineVisible: boolean;
  introVisible: boolean;
  isFav: boolean;
}
