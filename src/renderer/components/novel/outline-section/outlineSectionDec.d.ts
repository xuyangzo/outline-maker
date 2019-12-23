import { RouteComponentProps } from 'react-router-dom';
import { Outline } from '../../sidebar/sidebarDec';

export interface OutlineSectionProps extends RouteComponentProps {
  outlines: Outline[];
  novel_id: string;

  refreshOutline: (id: string) => void;
  onCreateOutline: () => void;
}