import { Action, ActionCreator } from 'redux';

export const CREATE_OUTLINE = 'CREATE_OUTLINE';
export const CLOSE_CREATE_MODAL = 'CLOSE_CREATE_MODAL';

export interface CreateOutlineAction extends Action {
	type: 'CREATE_OUTLINE';
}

export interface CloseCreateModalAction extends Action {
	type: 'CLOSE_CREATE_MODAL';
}

export const create: ActionCreator<CreateOutlineAction> = () => ({
	type: CREATE_OUTLINE
});

export const close: ActionCreator<CloseCreateModalAction> = () => ({
	type: CLOSE_CREATE_MODAL
});

export type OutlineAction = CreateOutlineAction | CloseCreateModalAction;
