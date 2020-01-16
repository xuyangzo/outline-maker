export interface OutlineModalProps {
  showModal: boolean;
  novel_id: string;

  closeModal: () => void;
  refreshOutline: () => void;
}

export interface OutlineModalTemplate {
  novel_id?: string;
  title: string;
  description?: string;
}