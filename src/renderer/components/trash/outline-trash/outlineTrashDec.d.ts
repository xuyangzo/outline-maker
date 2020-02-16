export interface OutlineTrashDataValue {
  id: number;
  title: string;
  description: string;
}

export interface OutlineTrashProps {
  outlines: number[];
  batchDelete: boolean;

  refresh: () => void;
}