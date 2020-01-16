import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Novel from '../components/novel/Novel';
import NovelEdit from '../components/novel/NovelEdit';
import { RootState } from '../reducers';
import { SidebarAction, refresh } from '../actions/sidebarActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

const mapDispatchToProps = (dispatch: Dispatch<SidebarAction>) => ({
	refreshSidebar: () => dispatch(refresh()),
});

export const NovelContainer = connect(mapStateToProps, mapDispatchToProps)(Novel);
export const NovelEditContainer = connect(mapStateToProps, mapDispatchToProps)(NovelEdit);
