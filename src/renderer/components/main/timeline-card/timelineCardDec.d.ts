export interface TimelineCardProps {
  time: string;
  id: number;
  isFirst: boolean;

  onTimelineChange: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteTimelineLocally: (id: number) => void;
}

export interface TimelineCardState {
  showEdit: boolean;
  deleteModal: boolean;
}