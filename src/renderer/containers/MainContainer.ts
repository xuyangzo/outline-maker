import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Main from '../components/main/Main';
import { RootState } from '../reducers';
import { SidebarAction, refresh } from '../actions/sidebarActions';
import { OutlineAction, refreshMain } from '../actions/outlineActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand,
	updateMain: state.outline.refreshMainContent
});

const mapDispatchToProps = (dispatch: Dispatch<SidebarAction | OutlineAction>) => ({
	refreshSidebar: () => dispatch(refresh()),
	refreshMain: () => dispatch(refreshMain())
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
