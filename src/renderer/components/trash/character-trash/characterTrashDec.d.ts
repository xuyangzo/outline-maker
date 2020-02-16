export interface CharacterTrashDataValue {
  id: number;
  name: string;
}

export interface CharacterTrashProps {
  characters: number[];
  batchDelete: boolean;

  refresh: () => void;
}