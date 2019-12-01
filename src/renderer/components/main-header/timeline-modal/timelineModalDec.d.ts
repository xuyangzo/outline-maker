export interface TimelineModalProps {
  showModal: boolean;

  closeModal: () => void;
  createTimelineLocally: (time: string) => void;
}

export interface TimelineModalState {
  time: string;
}