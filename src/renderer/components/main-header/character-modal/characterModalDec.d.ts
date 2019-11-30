export interface CharacterModalProps {
  showModal: boolean;
  id: string;

  closeModal: () => void;
  refreshMain: () => void;
}

export interface CharacterModalState {
  name: string;
}

export interface CharacterModalTemplate {
  title: string;
  description?: string;
}