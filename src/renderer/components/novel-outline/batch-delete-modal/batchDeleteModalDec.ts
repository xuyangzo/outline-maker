export interface BatchDeleteModalProps {
	showModel: boolean;
	checkedList: string[];

	closeModel: () => void;
	refreshOutline: () => void;
	clearCheckedList: () => void;
}
