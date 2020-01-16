import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
	novel_id: string;
}

export interface NovelCharacterProps extends RouteComponentProps<MatchParams> {
	expand: boolean;
}
