export interface BatchDeleteModalProps {
	showModel: boolean;
	checkedList: string[];

	closeModel: () => void;
	refreshLocation: () => void;
	clearCheckedList: () => void;
}
