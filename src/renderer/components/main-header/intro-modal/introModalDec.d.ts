export interface IntroModalProps {
  showModal: boolean;
  id: string;
  title: string;
  description: string;

  closeModal: () => void;
  refreshSidebar: () => void;
  refreshMain: () => void;
}

export interface IntroModalState {
  title: string;
  description: string;
}