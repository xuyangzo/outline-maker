import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import CreateModal from '../components/create-modal/CreateModal';
import { RootState } from '../reducers';
import { OutlineAction, close } from '../actions/outlineActions';
import { SidebarAction, refresh } from '../actions/sidebarActions';

const mapStateToProps = (state: RootState) => ({
	showModal: state.outline.showOutlineModal
});

const mapDispatchToProps = (dispatch: Dispatch<OutlineAction | SidebarAction>) => ({
	closeModal: () => dispatch(close()),
	refreshSidebar: () => dispatch(refresh())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateModal);
