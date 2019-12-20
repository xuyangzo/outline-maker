export interface LocationModalProps {
  showModal: boolean;
  id: string;

  closeModal: () => void;
  refreshLocation: (id: string) => void;
}

export interface LocationModalState {
  name: string;
}