import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import NovelOutline from '../components/novel-outline/NovelOutline';
import NovelOutlineEdit from '../components/novel-outline/NovelOutlineEdit';
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

export const NovelOutlineContainer = connect(mapStateToProps)(NovelOutline);
export const NovelOutlineEditContainer = connect(mapStateToPropsEditVersion, mapDispatchToProps)(NovelOutlineEdit);
