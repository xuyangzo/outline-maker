import { connect } from 'react-redux';

import Location from '../components/location/Location';
// import CharacterEdit from '../components/character/CharacterEdit';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export const LocationContainer = connect(mapStateToProps)(Location);
// export const CharacterEditContainer = connect(mapStateToProps)(CharacterEdit);
