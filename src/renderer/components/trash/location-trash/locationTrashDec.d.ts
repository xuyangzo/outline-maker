export interface TrashLocationDataValue {
  id: number;
  name: string;
}

export interface LocationTrashProps {
  locations: number[];
  batchDelete: boolean;

  refresh: () => void;
}