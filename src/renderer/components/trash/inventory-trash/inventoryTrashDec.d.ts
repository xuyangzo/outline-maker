export interface TrashInventoryDataValue {
  id: number;
  name: string;
}

export interface InventoryTrashProps {
  inventories: number[];
  batchDelete: boolean;

  refresh: () => void;
}