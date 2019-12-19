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

// get selected key
export const getSelectedKey = (pathname: string): string => {
	// set selected keys
	let selected = 'tutorial';
	if (pathname.indexOf('novel') !== -1) {
		selected = pathname.slice(7);
	} else if (pathname.indexOf('trash') !== -1) {
		selected = 'trash';
	} else if (pathname.indexOf('favorite') !== -1) {
		selected = 'fav';
	} else if (pathname.indexOf('outline') !== -1) {
		const next = pathname.slice(9);
		selected = next.slice(0, next.indexOf('/'));
	} else if (pathname.indexOf('character') !== -1) {
		const next = pathname.slice(11);
		selected = next.slice(0, next.indexOf('/'));
	} else if (pathname.lastIndexOf('location') !== -1) {
		const next = pathname.slice(10);
		selected = next.slice(0, next.indexOf('/'));
	}

	return selected;
};

// generate numbered string
export const getNumberedText = (text: string): string => {
	// check edge case
	if (!text) return '暂无';

	let result: string = '';
	const lists: string[] = text.split(',');
	for (let i = 0; i < lists.length; ++i) {
		result = result.concat(`${i + 1}. `, lists[i], '\n');
	}
	return result;
};
