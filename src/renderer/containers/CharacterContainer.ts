import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import NovelCharacter from '../components/novel-character/NovelCharacter';
import NovelCharacterEdit from '../components/novel-character/NovelCharacterEdit';
import Character from '../components/character/Character';
import CharacterEdit from '../components/character/CharacterEdit';
import { RootState } from '../reducers';
import { GuardAction, edit, save } from '../actions/guardActions';

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
	setSave: () => dispatch(save())
});

export const NovelCharacterContainer = connect(mapStateToProps)(NovelCharacter);
export const NovelCharacterEditContainer = connect(mapStateToPropsEditVersion, mapDispatchToProps)(NovelCharacterEdit);
export const CharacterContainer = connect(mapStateToProps)(Character);
export const CharacterEditContainer = connect(mapStateToPropsEditVersion, mapDispatchToProps)(CharacterEdit);
