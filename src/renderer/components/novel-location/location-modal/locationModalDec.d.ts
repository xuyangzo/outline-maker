export interface LocationModalProps {
  showModal: boolean;
  novel_id: string;

  closeModal: () => void;
  refreshLocation: () => void;
}