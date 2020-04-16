import { RouteComponentProps } from 'react-router-dom';

// params of url
interface MatchParams {
  id: string;
}

// background declaration
export interface BackgroundDec {
  id: number;
  title: string;
  content: string;
}

// background edit declaration
export interface BackgroundEditDec extends BackgroundDec {
  created?: boolean;
  updated?: boolean;
  deleted?: boolean;
}

/**
 * background datavalues for database
 * additional atttributes are created time and updated time
 */
export interface BackgroundDataValue {
  id: number;
  title: string;
  content: string;
}

export interface BackgroundProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface BackgroundEditProps extends BackgroundProps {
  edited: boolean;

  setEdit: () => void;
  setSave: () => void;
  setOpen: () => void;
  setRedirect: (payload: string) => void;
}

export interface BackgroundState {
  novel_id: string;
  backgrounds: BackgroundDec[];
}

export interface BackgroundEditState {
  novel_id: string;
  backgrounds: BackgroundEditDec[];
}