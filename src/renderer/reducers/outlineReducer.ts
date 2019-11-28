import { Reducer } from 'redux';

import { CREATE_OUTLINE, CLOSE_CREATE_MODAL, OutlineAction } from '../actions/outlineActions';

export interface OutlineState {
	readonly showOutlineModal: boolean;
}

const defaultState: OutlineState = {
	showOutlineModal: false
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
		default:
			return state;
	}
};
