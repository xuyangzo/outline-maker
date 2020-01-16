import { connect } from 'react-redux';

import NovelCharacter from '../components/novel-character/NovelCharacter';
import NovelCharacterEdit from '../components/novel-character/NovelCharacterEdit';
import Character from '../components/character/Character';
import CharacterEdit from '../components/character/CharacterEdit';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export const NovelCharacterContainer = connect(mapStateToProps)(NovelCharacter);
export const NovelCharacterEditContainer = connect(mapStateToProps)(NovelCharacterEdit);
export const CharacterContainer = connect(mapStateToProps)(Character);
export const CharacterEditContainer = connect(mapStateToProps)(CharacterEdit);
