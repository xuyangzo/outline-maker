export interface InventoryModalProps {
  showModal: boolean;
  novel_id: string;

  closeModal: () => void;
  refreshInventory: () => void;
}