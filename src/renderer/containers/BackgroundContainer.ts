import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Background from '../components/background/Background';
import BackgroundEdit from '../components/background/BackgroundEdit';
import { RootState } from '../reducers';
import { GuardAction, edit, save, open, redirect } from '../actions/guardActions';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

// added edited property
const mapStateToPropsEditVersion = (state: RootState) => ({
	expand: state.sidebar.expand,
	edited: state.guard.edited
});

// added edited methods
const mapDispatchToProps = (dispatch: Dispatch<GuardAction>) => ({
	setEdit: () => dispatch(edit()),
	setSave: () => dispatch(save()),
	setOpen: () => dispatch(open()),
	setRedirect: (payload: string) => dispatch(redirect(payload))
});

export const BackgroundContainer = connect(mapStateToProps)(Background);
export const BackgroundEditContainer = connect(mapStateToPropsEditVersion, mapDispatchToProps)(BackgroundEdit);
