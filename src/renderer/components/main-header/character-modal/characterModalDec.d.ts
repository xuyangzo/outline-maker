export interface CharacterMainDataValue {
  id: number;
  name: string;
}

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
  characters: CharacterMainDataValue[];
  selectedCharacter: string;
}