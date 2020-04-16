import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import NovelLocation from '../components/novel-location/NovelLocation';
import NovelLocationEdit from '../components/novel-location/NovelLocationEdit';
import Location from '../components/location/Location';
import LocationEdit from '../components/location/LocationEdit';
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

const mapDispatchToProps = (dispatch: Dispatch<GuardAction>) => ({
	setEdit: () => dispatch(edit()),
	setSave: () => dispatch(save()),
	setOpen: () => dispatch(open()),
	setRedirect: (payload: string) => dispatch(redirect(payload))
});

export const NovelLocationContainer = connect(mapStateToProps)(NovelLocation);
export const NovelLocationEditContainer = connect(mapStateToPropsEditVersion, mapDispatchToProps)(NovelLocationEdit);
export const LocationContainer = connect(mapStateToProps)(Location);
export const LocationEditContainer = connect(mapStateToPropsEditVersion, mapDispatchToProps)(LocationEdit);
