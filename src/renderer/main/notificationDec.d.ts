import { RouteComponentProps } from 'react-router-dom';

export interface NotificationProps extends RouteComponentProps {
  expand: boolean;

  refreshSidebar: () => void;
}