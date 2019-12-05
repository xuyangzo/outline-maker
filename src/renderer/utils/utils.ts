import { Character, Timeline } from '../components/main/mainDec';

// textarea height auto grow
export const onTextAreaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
	/**
   * scrollHeight is restricted by height
   * therefore need to set height to 1 first
   */
	e.target.style.height = '1px';
	e.target.style.height = `${e.target.scrollHeight}px`;
};

// filter update by id
export function filterUpdateById(arr: any, id: number, value: string, isTime: boolean) {
	console.log('val', value);
	return arr.map((element: Character & Timeline) => {
		if (element.id === id) {
			if (isTime) element.time = value;
			else element.name = value;
			element.updated = true;
			return element;
		}
		return element;
	});
}

// when control + s is pressed
export const ctrlsPress = (e: KeyboardEvent, callback: Function) => {
	const controlPress = e.ctrlKey || e.metaKey;
	const sPress = String.fromCharCode(e.which).toLowerCase() === 's';
	if (controlPress && sPress) {
		callback();
	}
};

// filter result of save
export const filterSaveResult = (result: any[]): any[] => {
	return result.filter((r: any) => {
		return typeof r !== 'number' &&
			typeof r !== 'undefined' &&
			!Array.isArray(r);
	});
};
