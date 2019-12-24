export interface OutlineModalProps {
  showModal: boolean;
  id: string;

  closeModal: () => void;
  refreshOutline: (id: string) => void;
}

export interface OutlineModalTemplate {
  novel_id?: string;
  title: string;
  description?: string;
}