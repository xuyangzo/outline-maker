export interface LocationTrashProps {
  locations: number[];
  batchDelete: boolean;

  refresh: () => void;
}