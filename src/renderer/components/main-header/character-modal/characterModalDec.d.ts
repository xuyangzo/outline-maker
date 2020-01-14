import { Character } from '../../character/characterDec';

export interface CharacterModalProps {
  showModal: boolean;
  novel_id: string;
  outline_id: string;

  closeModal: () => void;
  createCharacterLocally: (name: string) => void;
  importCharacterLocally: (id: string) => void;
}

export interface CharacterModalState {
  name: string;
  characters: Character[];
  selectedCharacter: string;
}