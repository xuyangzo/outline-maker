import { connect } from 'react-redux';

import Character from '../components/character/Character';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export default connect(mapStateToProps)(Character);
