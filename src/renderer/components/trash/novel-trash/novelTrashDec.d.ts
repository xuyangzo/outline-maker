export interface NovelTrashDataValue {
  id: number;
  name: string;
}

export interface NovelTrashProps {
  novels: number[];
  batchDelete: boolean;

  refresh: () => void;
  refreshSidebar: () => void;
}