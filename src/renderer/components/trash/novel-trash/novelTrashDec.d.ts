export interface NovelTrashProps {
  novels: number[];
  batchDelete: boolean;

  refresh: () => void;
  refreshSidebar: () => void;
}