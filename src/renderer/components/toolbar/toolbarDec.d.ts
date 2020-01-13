export interface ToolbarProps {
  scaling: string;

  onChangeScaling: (scaling: string) => void;
  onTogglePlus: (checked: boolean) => void;
}