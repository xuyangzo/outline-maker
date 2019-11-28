import { Action, ActionCreator } from 'redux';

export const SHRINK = 'SHRINK';
export const GROW = 'GROW';
export const REFRESH = 'REFRESH';
export const STOP_REFRESH = 'STOP_REFRESH';

export interface ShrinkAction extends Action {
	type: 'SHRINK';
}
export interface GrowAction extends Action {
	type: 'GROW';
}

export interface RefreshSidebarAction extends Action {
	type: 'REFRESH';
}

export interface StopRefreshAction extends Action {
	type: 'STOP_REFRESH';
}

export const shrink: ActionCreator<ShrinkAction> = () => ({
	type: SHRINK
});

export const grow: ActionCreator<GrowAction> = () => ({
	type: GROW
});

export const refresh: ActionCreator<RefreshSidebarAction> = () => ({
	type: REFRESH
});

export const stop: ActionCreator<StopRefreshAction> = () => ({
	type: STOP_REFRESH
});

export type SidebarAction = ShrinkAction | GrowAction | RefreshSidebarAction | StopRefreshAction;
