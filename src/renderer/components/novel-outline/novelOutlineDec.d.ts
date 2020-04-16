import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  novel_id: string;
}

export interface NovelOutlineDataValue {
  id: number;
  title: string;
  description: string;
}

export interface NovelOutlineProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface NovelOutlineEditProps extends NovelOutlineProps {
  edited: boolean;

  setEdit: () => void;
  setSave: () => void;
  setOpen: () => void;
  setRedirect: (payload: string) => void;
}