import { connect } from 'react-redux';

import Background from '../components/background/Background';
// import LocationEdit from '../components/location/LocationEdit';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export const BackgroundContainer = connect(mapStateToProps)(Background);
// export const BackgroundEditContainer = connect(mapStateToProps)(BackgroundEdit);
