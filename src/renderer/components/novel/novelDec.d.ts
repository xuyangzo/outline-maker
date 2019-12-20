import { RouteComponentProps } from 'react-router-dom';
import { Character } from '../main/mainDec';
import { Outline } from '../sidebar/sidebarDec';

interface MatchParams {
  id: string;
}

export interface Location {
  id: number;
  name: string;
  image: string;
  intro: string;
  texture: string;
  location: string;
  controller: string;
}

export interface LocationDataValue {
  id: number;
  novel_id: number;
  name: string;
  image: string;
  intro: string;
  texture: string;
  location: string;
  controller: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovelProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface NovelState {
  id: string;
  name: string;
  description: string;
  categories: string[];
  characters: Character[];
  outlines: Outline[];
  locations: Location[];
  createCharacter: boolean;
  createOutline: boolean;
  createLocation: boolean;
  shouldRenderCharacter: boolean;
  shouldRenderOutline: boolean;
  shouldRenderLocation: boolean;
}