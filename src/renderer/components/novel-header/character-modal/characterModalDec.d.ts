export interface CharacterModalProps {
  showModal: boolean;
  id: string;

  closeModal: () => void;
  refreshCharacter: (id: string) => void;
}