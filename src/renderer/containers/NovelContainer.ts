import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Novel from '../components/novel/Novel';
import NovelEdit from '../components/novel/NovelEdit';
import { RootState } from '../reducers';
import { SidebarAction, refresh } from '../actions/sidebarActions';
import { GuardAction, edit, save, open, redirect } from '../actions/guardActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

// added edited property
const mapStateToPropsEditVersion = (state: RootState) => ({
	expand: state.sidebar.expand,
	edited: state.guard.edited
});

const mapDispatchToProps = (dispatch: Dispatch<SidebarAction>) => ({
	refreshSidebar: () => dispatch(refresh()),
});

// added edited methods
const mapDispatchToPropsEditVersion = (dispatch: Dispatch<SidebarAction | GuardAction>) => ({
	refreshSidebar: () => dispatch(refresh()),
	setEdit: () => dispatch(edit()),
	setSave: () => dispatch(save()),
	setOpen: () => dispatch(open()),
	setRedirect: (payload: string) => dispatch(redirect(payload))
});

export const NovelContainer = connect(mapStateToProps, mapDispatchToProps)(Novel);
export const NovelEditContainer = connect(mapStateToPropsEditVersion, mapDispatchToPropsEditVersion)(NovelEdit);
