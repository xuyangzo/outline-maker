import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  novel_id: string;
}

export interface NovelLocationDataValue {
  id: number;
  name: string;
  image: string;
}

export interface NovelLocationProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface NovelLocationEditProps extends NovelLocationProps {
  edited: boolean;

  setEdit: () => void;
  setSave: () => void;
  setOpen: () => void;
  setRedirect: (payload: string) => void;
}
