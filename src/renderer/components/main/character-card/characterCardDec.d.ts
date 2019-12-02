export interface CharacterCardProps {
  name: string;
  id: number;
  color: string;

  onCharacterNameChange: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CharacterCardState {

}