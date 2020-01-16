import { connect } from 'react-redux';

import NovelOutline from '../components/novel-outline/NovelOutline';
import NovelOutlineEdit from '../components/novel-outline/NovelOutlineEdit';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export const NovelOutlineContainer = connect(mapStateToProps)(NovelOutline);
export const NovelOutlineEditContainer = connect(mapStateToProps)(NovelOutlineEdit);
