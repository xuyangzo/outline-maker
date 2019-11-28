import { combineReducers } from 'redux';

import { SidebarState, sidebarReducer } from './sidebarReducer';
import { OutlineState, outlineReducer } from './outlineReducer';

export interface RootState {
	sidebar: SidebarState;
	outline: OutlineState;
}

export const rootReducer = combineReducers<RootState | undefined>({
	sidebar: sidebarReducer,
	outline: outlineReducer
});
