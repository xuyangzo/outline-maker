import { RouteComponentProps } from 'react-router-dom';

export interface NovelHeaderProps extends RouteComponentProps {
  createCharacter: boolean;
  createOutline: boolean;
  createLocation: boolean;
  id: string;
  isEdit: boolean;

  refreshCharacter: (id: string) => void;
  refreshOutline: (id: string) => void;
  refreshLocation: (id: string) => void;
  refreshSidebar: () => void;
  cancelCreateCharacter: () => void;
  cancelCreateOutline: () => void;
  cancelCreateLocation: () => void;
  enterEditMode: () => void;
  quitEditMode: () => void;
  batchDelete: () => void;
  resetBatchDelete: () => void;
}