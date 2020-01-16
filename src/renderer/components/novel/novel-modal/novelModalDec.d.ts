import { RouteComponentProps } from 'react-router-dom';

export interface NovelModalProps extends RouteComponentProps {
  id: string;
  showModal: boolean;

  closeModal: () => void;
  refreshSidebar: () => void;
}