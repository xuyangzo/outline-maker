import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Novel from '../components/novel/Novel';
import { RootState } from '../reducers';
import { SidebarAction, refresh } from '../actions/sidebarActions';
import { OutlineAction, create } from '../actions/outlineActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

const mapDispatchToProps = (dispatch: Dispatch<OutlineAction | SidebarAction>) => ({
	createOutline: () => dispatch(create()),
	refreshSidebar: () => dispatch(refresh()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Novel);
