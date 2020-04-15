import { combineReducers } from 'redux';

import { SidebarState, sidebarReducer } from './sidebarReducer';
import { OutlineState, outlineReducer } from './outlineReducer';
import { GuardState, guardReducer } from './guardReducer';

export interface RootState {
	sidebar: SidebarState;
	outline: OutlineState;
	guard: GuardState;
}

export const rootReducer = combineReducers<RootState | undefined>({
	sidebar: sidebarReducer,
	outline: outlineReducer,
	guard: guardReducer
});
