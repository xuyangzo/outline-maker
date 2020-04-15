import { Reducer } from 'redux';

import { EDIT, SAVE, OPEN, CLOSE, GuardAction, SET_REDIRECT } from '../actions/guardActions';

export interface GuardState {
	readonly edited: boolean;
	readonly openModal: boolean;
	readonly redirectUrl: string;
}

const defaultState: GuardState = {
	edited: false,
	openModal: false,
	redirectUrl: ''
};

export const guardReducer: Reducer<GuardState> = (
	state = defaultState,
	action: GuardAction
) => {
	switch (action.type) {
		case EDIT:
			return {
				...state,
				edited: true
			};
		case SAVE:
			return {
				...state,
				edited: false
			};
		case OPEN:
			return {
				...state,
				openModal: true
			};
		case CLOSE:
			return {
				...state,
				openModal: false
			};
		case SET_REDIRECT:
			return {
				...state,
				redirectUrl: action.payload
			};
		default:
			return state;
	}
};
