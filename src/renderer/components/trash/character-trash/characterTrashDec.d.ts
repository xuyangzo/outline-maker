export interface CharacterTrashProps {
  characters: number[];
  batchDelete: boolean;

  refresh: () => void;
}