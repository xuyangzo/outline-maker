import { connect } from 'react-redux';

import NovelLocation from '../components/novel-location/NovelLocation';
import NovelLocationEdit from '../components/novel-location/NovelLocationEdit';
import Location from '../components/location/Location';
import LocationEdit from '../components/location/LocationEdit';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export const NovelLocationContainer = connect(mapStateToProps)(NovelLocation);
export const NovelLocationEditContainer = connect(mapStateToProps)(NovelLocationEdit);
export const LocationContainer = connect(mapStateToProps)(Location);
export const LocationEditContainer = connect(mapStateToProps)(LocationEdit);
