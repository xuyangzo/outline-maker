import { Reducer } from 'redux';

import { SHRINK, GROW, REFRESH, SidebarAction, STOP_REFRESH } from '../actions/sidebarActions';

export interface SidebarState {
	readonly expand: boolean;
	readonly refresh: boolean;
}

const defaultState: SidebarState = {
	expand: true,
	refresh: false
};

export const sidebarReducer: Reducer<SidebarState> = (
	state = defaultState,
	action: SidebarAction
) => {
	switch (action.type) {
		case SHRINK:
			return {
				...state,
				expand: false
			};
		case GROW:
			return {
				...state,
				expand: true
			};
		case REFRESH:
			return {
				...state,
				refresh: true
			};
		case STOP_REFRESH:
			return {
				...state,
				refresh: false
			};
		default:
			return state;
	}
};
