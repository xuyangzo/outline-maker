export interface CharacterModelProps {
  showModal: boolean;
  novel_id: string;

  closeModal: () => void;
  refreshCharacter: () => void;
}