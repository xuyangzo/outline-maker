import { Action, ActionCreator } from 'redux';

export const SHRINK = 'SHRINK';
export const GROW = 'GROW';

export interface ShrinkAction extends Action {
		type: 'SHRINK';
}
export interface GrowAction extends Action {
		type: 'GROW';
}

export const shrink: ActionCreator<ShrinkAction> = () => ({
		type: SHRINK
});

export const grow: ActionCreator<GrowAction> = () => ({
		type: GROW
});

export type SidebarAction = ShrinkAction | GrowAction;
