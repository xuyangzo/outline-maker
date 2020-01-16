import { RouteComponentProps } from 'react-router-dom';

// params of url
interface MatchParams {
  id: string;
  novel_id: string;
}

// complete character declaration
export interface Character {
  id: string | number;
  novel_id: string | number;
  outline_id?: string | number | undefined;
  name: string;
  image?: string | undefined;
  color?: string | undefined;
  age?: string | undefined;
  nickname?: string | undefined;
  gender?: number | undefined;
  height?: string | undefined;
  identity?: string | undefined;
  appearance?: string | undefined;
  characteristics?: string | undefined;
  experience?: string | undefined;
  deleted?: number;
  novelPageOrder?: number;
}

/**
 * character datavalues for database
 * additional atttributes are created time and updated time
 */
export interface CharacterDataValue extends Character {
  createdAt: string;
  updatedAt: string;
}

export interface CharacterShortDataValue {
  id: number;
  name: string;
}


export interface CharacterProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface CharacterState extends Character {
  [key: string]: string | number | undefined;
}

export type CharacterEditState = {
  id: number | string,
  outline_id: number | string | undefined,
  novel_id: number | string,
  name: string,
  image: string,
  age: string,
  nickname: string,
  gender: number,
  height: string,
  identity: string,
  appearance: string,
  characteristics: string,
  experience: string,
  [key: string]: any
};