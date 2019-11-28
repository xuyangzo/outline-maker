import { connect } from 'react-redux';

import Tutorial from '../components/tutorial/Tutorial';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export default connect(mapStateToProps)(Tutorial);
