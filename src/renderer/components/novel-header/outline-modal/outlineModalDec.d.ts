import { RouteComponentProps } from 'react-router-dom';

export interface OutlineModalProps extends RouteComponentProps {
  showModal: boolean;
  id: string;

  closeModal: () => void;
  refreshOutline: (id: string) => void;
}

export interface OutlineModalState {
  title: string;
  description: string;
}

export interface OutlineModalTemplate {
  novel_id: string;
  title: string;
  description?: string;
}