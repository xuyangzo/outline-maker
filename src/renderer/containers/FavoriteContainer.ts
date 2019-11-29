import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Favorite from '../components/favorite/Favorite';
import { RootState } from '../reducers';
import { SidebarAction, refresh } from '../actions/sidebarActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

const mapDispatchToProps = (dispatch: Dispatch<SidebarAction>) => ({
	refreshSidebar: () => dispatch(refresh())
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
