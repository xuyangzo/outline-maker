import { connect } from 'react-redux';

import Novel from '../components/novel/Novel';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export default connect(mapStateToProps)(Novel);
