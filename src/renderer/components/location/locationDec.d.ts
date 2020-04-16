import { RouteComponentProps } from 'react-router-dom';

// params of url
interface MatchParams {
  id: string;
  novel_id: string;
}

// location datavalues for database
export interface LocationDataValue {
  name: string;
  image: string;
  intro: string;
  texture: string;
  location: string;
  controller: string;
}

export interface LocationProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface LocationEditProps extends LocationProps {
  edited: boolean;

  setEdit: () => void;
  setSave: () => void;
  setOpen: () => void;
  setRedirect: (payload: string) => void;
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