import { connect } from 'react-redux';

import Character from '../components/character/Character';
import CharacterEdit from '../components/character/CharacterEdit';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export const CharacterContainer = connect(mapStateToProps)(Character);
export const CharacterEditContainer = connect(mapStateToProps)(CharacterEdit);
