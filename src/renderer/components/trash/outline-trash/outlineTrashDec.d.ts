export interface OutlineTrashProps {
  outlines: number[];
  batchDelete: boolean;

  refresh: () => void;
}