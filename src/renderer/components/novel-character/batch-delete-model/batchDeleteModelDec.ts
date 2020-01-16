export interface BatchDeleteModelProps {
	showModel: boolean;
	checkedList: string[];

	closeModel: () => void;
	refreshCharacter: () => void;
	clearCheckedList: () => void;
}
