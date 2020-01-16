import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  novel_id: string;
}

export interface NovelLocationProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}
