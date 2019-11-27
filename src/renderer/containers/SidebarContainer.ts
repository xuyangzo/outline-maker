import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Sidebar from '../components/sidebar/Sidebar';
import { RootState } from '../reducers';
import { SidebarAction, shrink, grow } from '../actions/sidebarActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

const mapDispatchToProps = (dispatch: Dispatch<SidebarAction>) => ({
	shrinkSidebar: () => dispatch(shrink()),
	growSidebar: () => dispatch(grow())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Sidebar);
