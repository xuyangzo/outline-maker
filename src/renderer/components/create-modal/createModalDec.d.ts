export interface CreateModalProps {
  showModal: boolean;

  closeModal: () => void;
  refreshSidebar: () => void;
}

export interface CreateModalState {
  title: string;
  description: string;
}