import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  id: string;
}

export interface NovelDataValues {

}

export interface NovelProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface NovelState {
  name: string;
  description: string;
  categories: string[];
}