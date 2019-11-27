import { Reducer } from 'redux';

import { SHRINK, GROW, SidebarAction } from '../actions/sidebarActions';

export interface SidebarState {
	readonly expand: boolean;
}

const defaultState: SidebarState = {
	expand: true
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
		default:
			return state;
	}
};
