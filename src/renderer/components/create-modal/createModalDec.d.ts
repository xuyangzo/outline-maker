import { RouteComponentProps } from 'react-router-dom';

export interface CreateModalProps extends RouteComponentProps {
  showModal: boolean;

  closeModal: () => void;
  refreshSidebar: () => void;
}

export interface CreateModalState {
  title: string;
  description: string;
}