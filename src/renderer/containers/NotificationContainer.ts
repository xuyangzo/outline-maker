import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Notification from '../main/notification/Notification';
import { RootState } from '../reducers';
import { SidebarAction, refresh } from '../actions/sidebarActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

const mapDispatchToProps = (dispatch: Dispatch<SidebarAction>) => ({
	refreshSidebar: () => dispatch(refresh()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
