import { RouteComponentProps } from 'react-router-dom';

export interface BackgroundSectionProps extends RouteComponentProps {
  novel_id: string;
  isEdit: boolean;
}