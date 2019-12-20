import { connect } from 'react-redux';

import Location from '../components/location/Location';
import LocationEdit from '../components/location/LocationEdit';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export const LocationContainer = connect(mapStateToProps)(Location);
export const LocationEditContainer = connect(mapStateToProps)(LocationEdit);
