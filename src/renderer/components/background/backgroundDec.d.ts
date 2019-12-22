import { RouteComponentProps } from 'react-router-dom';

// params of url
interface MatchParams {
  id: string;
}

// complete background declaration
export interface Background {
  id: number;
  title: string;
  content: string;
  created?: boolean;
  updated?: boolean;
  deleted?: boolean;
}

/**
 * background datavalues for database
 * additional atttributes are created time and updated time
 */
export interface BackgroundDataValue extends Background {
  createdAt: string;
  updatedAt: string;
}

export interface BackgroundProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface BackgroundState {
  novel_id: string;
  backgrounds: Background[];
}

export interface BackgroundEditState extends BackgroundState {

}