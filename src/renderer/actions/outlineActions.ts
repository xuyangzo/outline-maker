import { Action, ActionCreator } from 'redux';

export const CREATE_OUTLINE = 'CREATE_OUTLINE';
export const CLOSE_CREATE_MODAL = 'CLOSE_CREATE_MODAL';
export const REFRESH_MAIN = 'REFRESH_MAIN';
export const CANCEL_REFRESH_MAIN = 'CANCEL_REFRESH_MAIN';

export interface CreateOutlineAction extends Action {
	type: 'CREATE_OUTLINE';
}

export interface CloseCreateModalAction extends Action {
	type: 'CLOSE_CREATE_MODAL';
}

export interface RefreshMainAction extends Action {
	type: 'REFRESH_MAIN';
}

export interface CancelRefreshMainAction extends Action {
	type: 'CANCEL_REFRESH_MAIN';
}

export const create: ActionCreator<CreateOutlineAction> = () => ({
	type: CREATE_OUTLINE
});

export const close: ActionCreator<CloseCreateModalAction> = () => ({
	type: CLOSE_CREATE_MODAL
});

export const refreshMain: ActionCreator<RefreshMainAction> = () => ({
	type: REFRESH_MAIN
});

export const cancelRefreshMain: ActionCreator<CancelRefreshMainAction> = () => ({
	type: CANCEL_REFRESH_MAIN
});

export type OutlineAction =
	CreateOutlineAction |
	CloseCreateModalAction |
	RefreshMainAction |
	CancelRefreshMainAction;
