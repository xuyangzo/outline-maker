import { Action, ActionCreator } from 'redux';

export const EDIT = 'EDIT';
export const SAVE = 'SAVE';
export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const SET_REDIRECT = 'SET_REDIRECT';

export interface EditAction extends Action {
	type: 'EDIT';
}
export interface SaveAction extends Action {
	type: 'SAVE';
}

export interface OpenAction extends Action {
	type: 'OPEN';
}

export interface CloseAction extends Action {
	type: 'CLOSE';
}

export interface RedirectAction extends Action {
	type: 'SET_REDIRECT';
	payload: string;
}

export const edit: ActionCreator<EditAction> = () => ({
	type: EDIT
});

export const save: ActionCreator<SaveAction> = () => ({
	type: SAVE
});

export const open: ActionCreator<OpenAction> = () => ({
	type: OPEN
});

export const close: ActionCreator<CloseAction> = () => ({
	type: CLOSE
});

export const redirect: ActionCreator<RedirectAction> = (payload: string) => ({
	payload,
	type: SET_REDIRECT
});

export type GuardAction = EditAction | SaveAction | OpenAction | CloseAction | RedirectAction;
