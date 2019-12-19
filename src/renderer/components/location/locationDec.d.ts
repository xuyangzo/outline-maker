import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  id: string;
  novel_id: string;
}

export type Location = {
  id: number;
  novel_id: number;
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

// export interface CharacterEditState {
//   id: number | string;
//   outline_id: number | string;
//   novel_id: number | string;
//   name: string;
//   image: string;
//   age: string;
//   nickname: string;
//   gender: number;
//   height: string;
//   identity: string[];
//   appearance: string[];
//   characteristics: string[];
//   experience: string[];
//   [key: string]: any;
// }