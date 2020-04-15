import { RouteComponentProps } from 'react-router-dom';

export interface NovelCharacterDataValue {
	id: number;
	name: string;
	image: string;
	gender: number;
}

export interface NovelCharacterDataValues {
	main: NovelCharacterDataValue[];
	sub: NovelCharacterDataValue[];
}

interface MatchParams {
	novel_id: string;
}

export interface NovelCharacterProps extends RouteComponentProps<MatchParams> {
	expand: boolean;
}

export interface NovelCharacterEditProps extends NovelCharacterProps {
	edited: boolean;

	setEdit: () => void;
	setSave: () => void;
}
