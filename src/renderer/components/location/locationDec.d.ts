import { RouteComponentProps } from 'react-router-dom';

// params of url
interface MatchParams {
  id: string;
  novel_id: string;
}

// complete location declaration
export interface Location {
  id: number;
  novel_id: number;
  name: string;
  image: string;
  intro: string;
  texture: string;
  location: string;
  controller: string;
}

/**
 * location datavalues for database
 * additional atttributes are created time and updated time
 */
export interface LocationDataValue extends Location {
  createdAt: string;
  updatedAt: string;
}

export interface LocationProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

/**
 * location page and location edit page share same props and state
 * because their attributes are the same (different from character)
 */
export interface LocationState {
  id: number | string;
  novel_id: number | string;
  name: string;
  image: string;
  intro: string;
  texture: string;
  location: string;
  controller: string;
  [key: string]: string | number;
}