export interface BatchDeleteModalProps {
	showModel: boolean;
	checkedList: string[];

	closeModel: () => void;
	refreshInventory: () => void;
	clearCheckedList: () => void;
}
