import BackgroundModal from '../models/Background';

export const getWordviewGivenNovel = (id: string | number): Promise<any> => {
	return BackgroundModal
		.findOne({
			where: {
				novel_id: id,
				title: '世界观'
			}
		});
};
