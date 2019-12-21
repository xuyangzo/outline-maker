import { RouteComponentProps } from 'react-router-dom';

// params of url
interface MatchParams {
  novel_id: string;
}

// complete background declaration
export interface Background {
  id: number;
  novel_id: number;
  title: string;
  content: string;
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
}

export interface BackgroundEditState {

}