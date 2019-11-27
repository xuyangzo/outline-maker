import { combineReducers } from 'redux';

import { SidebarState, sidebarReducer } from './sidebarReducer';

export interface RootState {
	sidebar: SidebarState;
}

export const rootReducer = combineReducers<RootState | undefined>({
	sidebar: sidebarReducer
});
