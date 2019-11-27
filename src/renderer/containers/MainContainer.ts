import { connect } from 'react-redux';

import Main from '../components/main/Main';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export default connect(mapStateToProps)(Main);
