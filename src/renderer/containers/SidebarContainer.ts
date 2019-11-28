import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Sidebar from '../components/sidebar/Sidebar';
import { RootState } from '../reducers';
import { SidebarAction, shrink, grow, refresh, stop } from '../actions/sidebarActions';
import { OutlineAction, create } from '../actions/outlineActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand,
	refresh: state.sidebar.refresh,
	showModal: state.outline.showOutlineModal
});

const mapDispatchToProps = (dispatch: Dispatch<SidebarAction | OutlineAction>) => ({
	shrinkSidebar: () => dispatch(shrink()),
	growSidebar: () => dispatch(grow()),
	createOutline: () => dispatch(create()),
	stopRefreshSidebar: () => dispatch(stop())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Sidebar);
