import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Guard from '../components/guard/Guard';
import { RootState } from '../reducers';
import { GuardAction, open, close, save } from '../actions/guardActions';

const mapStateToProps = (state: RootState) => ({
	edited: state.guard.edited,
	openGuard: state.guard.openModal,
	redirectUrl: state.guard.redirectUrl
});

const mapDispatchToProps = (dispatch: Dispatch<GuardAction>) => ({
	setSave: () => dispatch(save()),
	setOpen: () => dispatch(open()),
	setClose: () => dispatch(close())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Guard);
