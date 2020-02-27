import { RouteComponentProps } from 'react-router-dom';

// params of url
interface MatchParams {
  id: string;
  novel_id: string;
}

// character datavalues for database
export interface CharacterDataValue {
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
  note: string;
}

export interface CharacterProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface CharacterState extends CharacterDataValue {
  outlines: OutlineCharacterDataValue[];
  inventories: InventoryCharacterDataValue[];
  id: number | string;
  novel_id: number | string;
  [key: string]: string | number | OutlineCharacterDataValue[] | InventoryCharacterDataValue[];
}

export interface CharacterEditState {
  id: number | string;
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
  note: string;
  [key: string]: any;
}

// outlines that belong to one character
export interface OutlineCharacterDataValue {
  id: number;
  title: string;
}

// inventories that belong to one character
export interface InventoryCharacterDataValue {
  id: number;
  name: string;
}