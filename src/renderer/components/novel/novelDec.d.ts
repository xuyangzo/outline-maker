import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  id: string;
}

export interface NovelDataValue {
  name: string;
  description: string;
  categories: string;
}

export interface NovelProps extends RouteComponentProps<MatchParams> {
  expand: boolean;

  refreshSidebar: () => void;
}

export interface NovelState {
  id: string;
  name: string;
  description: string;
  categories: string[];
}