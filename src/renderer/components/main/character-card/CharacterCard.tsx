import * as React from 'react';

// type declaration
import { CharacterCardProps, CharacterCardState } from './characterCardDec';

// sass
import './character-card.scss';

class CharacterCard extends React.Component<CharacterCardProps, CharacterCardState> {
	render() {
		const { name, id, onCharacterNameChange, color } = this.props;
		return (
			<th className="character-header">
				<div
					className="main-character-card"
					style={{ backgroundColor: color }}
				>
					<input
						type="text"
						value={name}
						style={{ backgroundColor: color }}
						onChange={
							(e: React.ChangeEvent<HTMLInputElement>) => onCharacterNameChange(id, e)
						}
					/>
				</div>
			</th>
		);
	}
}

export default CharacterCard;
