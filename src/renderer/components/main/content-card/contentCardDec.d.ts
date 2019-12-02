import { OutlineContent } from '../mainDec';

export interface ContentCardProps {
  color: string;
  character_id: number;
  timeline_id: number;
  contents: OutlineContent;
  isLast: boolean;
  isFirst: boolean;
  showPlusIcons: boolean;

  onTextareaResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onContentChange: (character_id: number, timeline_id: number, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  createTextAreaLocally: (character_id: number, timeline_id: number) => void;
}

export interface ContentCardState {

}