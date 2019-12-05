export interface CharacterCardProps {
  name: string;
  id: number;
  color: string;

  onCharacterNameChange: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteCharacterLocally: (id: number) => void;
  setColorLocally: (id: number, color: string) => void;
}

export interface CharacterCardState {
  showEdit: boolean;
  showToolbar: boolean;
  deleteModal: boolean;
  showColorPalette: boolean;
}