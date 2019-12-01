export interface CharacterModalProps {
  showModal: boolean;

  closeModal: () => void;
  createCharacterLocally: (name: string) => void;
}

export interface CharacterModalState {
  name: string;
}