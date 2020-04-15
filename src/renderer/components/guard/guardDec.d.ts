import { RouteComponentProps } from 'react-router-dom';

export interface GuardProps extends RouteComponentProps {
  openGuard: boolean;
  redirectUrl: string;

  setSave: () => void;
  setOpen: () => void;
  setClose: () => void;
}