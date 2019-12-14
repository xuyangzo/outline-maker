import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  id: string;
  novel_id: string;
}

export interface CharacterProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface CharacterState {

}