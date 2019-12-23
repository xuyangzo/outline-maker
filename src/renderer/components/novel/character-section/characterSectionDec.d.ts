import { RouteComponentProps } from 'react-router-dom';
import { Character } from '../../character/characterDec';

export interface CharacterSectionProps extends RouteComponentProps {
  characters: Character[];
  novel_id: string;

  refreshCharacter: (id: string) => void;
  onCreateCharacter: () => void;
}