export interface BatchDeleteModalProps {
	showModel: boolean;
	checkedList: string[];

	closeModel: () => void;
	refreshCharacter: () => void;
	clearCheckedList: () => void;
}
