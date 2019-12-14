import { RouteComponentProps } from 'react-router-dom';
import { Character } from '../main/mainDec';
import { Outline } from '../sidebar/sidebarDec';

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
  characters: Character[];
  outlines: Outline[];
}