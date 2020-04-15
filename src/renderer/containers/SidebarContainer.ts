import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Sidebar from '../components/sidebar/Sidebar';
import { RootState } from '../reducers';
import { SidebarAction, shrink, grow, stop } from '../actions/sidebarActions';
import { OutlineAction, create } from '../actions/outlineActions';
import { GuardAction, open, redirect } from '../actions/guardActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand,
	refresh: state.sidebar.refresh,
	edited: state.guard.edited,
	showModal: state.outline.showOutlineModal
});

const mapDispatchToProps = (dispatch: Dispatch<SidebarAction | OutlineAction | GuardAction>) => ({
	shrinkSidebar: () => dispatch(shrink()),
	growSidebar: () => dispatch(grow()),
	createOutline: () => dispatch(create()),
	stopRefreshSidebar: () => dispatch(stop()),
	setOpen: () => dispatch(open()),
	setRedirect: (payload: string) => dispatch(redirect(payload))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Sidebar);
