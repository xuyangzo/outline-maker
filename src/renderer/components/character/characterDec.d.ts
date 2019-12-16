import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  id: string;
  novel_id: string;
}

export type Character = {
  id: number;
  outline_id: number;
  novel_id: number;
  name: string;
  image: string;
  age: string;
  nickname: string;
  gender: number;
  height: string;
  identity: string;
  appearance: string;
  characteristics: string;
  experience: string;
}

export interface CharacterProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface CharacterState {
  id: number | string;
  outline_id: number | string;
  novel_id: number | string;
  name: string;
  image: string;
  age: string;
  nickname: string;
  gender: number;
  height: string;
  identity: string;
  appearance: string;
  characteristics: string;
  experience: string;
}