import { Reducer } from 'redux';

import {
	CREATE_OUTLINE,
	CLOSE_CREATE_MODAL,
	REFRESH_MAIN,
	CANCEL_REFRESH_MAIN,
	OutlineAction
} from '../actions/outlineActions';

export interface OutlineState {
	readonly showOutlineModal: boolean;
	readonly refreshMainContent: boolean;
}

const defaultState: OutlineState = {
	showOutlineModal: false,
	refreshMainContent: false
};

export const outlineReducer: Reducer<OutlineState> = (
	state = defaultState,
	action: OutlineAction
) => {
	switch (action.type) {
		case CREATE_OUTLINE:
			return {
				...state,
				showOutlineModal: true
			};
		case CLOSE_CREATE_MODAL:
			return {
				...state,
				showOutlineModal: false
			};
		case REFRESH_MAIN:
			return {
				...state,
				refreshMainContent: true
			};
		case CANCEL_REFRESH_MAIN:
			return {
				...state,
				refreshMainContent: false
			};
		default:
			return state;
	}
};
