import { RouteComponentProps } from 'react-router-dom';
import { Character } from '../character/characterDec';
import { Outline } from '../sidebar/sidebarDec';
import { Location } from '../location/locationDec';

interface MatchParams {
  id: string;
}

export interface NovelShortDataValue {
  id: number;
  name: string;
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
  characters: Character[];
  outlines: Outline[];
  locations: Location[];
  createCharacter: boolean;
  createOutline: boolean;
  createLocation: boolean;
  shouldRenderCharacter: boolean;
  shouldRenderOutline: boolean;
  shouldRenderLocation: boolean;
  isEdit: boolean;
  batchDelete: boolean;
}