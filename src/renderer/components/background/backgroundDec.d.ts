import { RouteComponentProps } from 'react-router-dom';

type MatchParams = {
  novel_id: string
};

export interface BackgroundProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface BackgroundState {
  novel_id: string;
}

export interface BackgroundEditState {

}