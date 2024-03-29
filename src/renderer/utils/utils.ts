import { MainCharacter, MainTimeline } from '../components/main/mainDec';

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
	return arr.map((element: MainCharacter & MainTimeline) => {
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

// get selected key
export const getSelectedKey = (pathname: string): string => {
	// single novel page and background page
	if (pathname.indexOf('novel') !== -1) return pathname.replace('/edit', '');
	if (pathname.indexOf('background') !== -1) return pathname.replace('/edit', '');

	// all the characters/locations/outlines/inventory page
	if (
		pathname.indexOf('characters') !== -1 ||
		pathname.indexOf('locations') !== -1 ||
		pathname.indexOf('outlines') !== -1 ||
		pathname.indexOf('inventories') !== -1
	) {
		return pathname.replace('/edit', '');
	}

	// trash and fav
	if (pathname.indexOf('trash') !== -1) return 'trash';
	if (pathname.indexOf('fav') !== -1) return 'fav';

	// single character page
	if (pathname.indexOf('character') !== -1) {
		// if /character/novel_id/id, take first 2
		const searchable = pathname.replace('/edit', '');
		let sliceIndex = -1;
		for (let i = searchable.length - 1; i >= 0; --i) {
			if (searchable[i] === '/') {
				sliceIndex = i;
				break;
			}
		}
		return searchable.slice(0, sliceIndex).replace('character', 'characters');
	}

	// single location page
	if (pathname.indexOf('location') !== -1) {
		// if /location/novel_id/id, take first 2
		const searchable = pathname.replace('/edit', '');
		let sliceIndex = -1;
		for (let i = searchable.length - 1; i >= 0; --i) {
			if (searchable[i] === '/') {
				sliceIndex = i;
				break;
			}
		}
		return searchable.slice(0, sliceIndex).replace('location', 'locations');
	}

	// single outline page
	if (pathname.indexOf('outline') !== -1) {
		// if /outline/novel_id/id, take first 2
		const searchable = pathname.replace('/edit', '');
		let sliceIndex = -1;
		for (let i = searchable.length - 1; i >= 0; --i) {
			if (searchable[i] === '/') {
				sliceIndex = i;
				break;
			}
		}
		return searchable.slice(0, sliceIndex).replace('outline', 'outlines');
	}

	// return tutorial page by default
	return 'tutorial';
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
