import { RouteComponentProps } from 'react-router-dom';

export interface NovelInventoryDataValue {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface MatchParams {
  novel_id: string;
}

export interface NovelInventoryProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}
