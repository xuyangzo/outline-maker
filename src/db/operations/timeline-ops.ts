import TimelineModal from '../models/Timeline';
import { deleteOutlineDetailsGivenTime } from './detail-ops';

// get all timelines givend outline id
export const getAllTimelines = async (id: string | number): Promise<any> => {
	const dataResults: DataResults = await TimelineModal
		.findAll({
			attributes: ['id', 'time'],
			where: {
				outline_id: id
			}
		});

	if (dataResults && dataResults.length) {
		return dataResults.map((result: DataModel) => result.dataValues);
	}

	return [];
};

// create new timeline
export const createTimeline = (id: string | number, time: string): Promise<DataUpdateResult> => {
	return TimelineModal
		.create({
			time,
			outline_id: id
		});
};

// update timeline
export const updateTimeline = (id: string | number, time: string): Promise<DataUpdateResult> => {
	return TimelineModal
		.update(
			{ time },
			{ where: { id } }
		);
};

// delete timeline
export const deleteTimeline = async (id: string | number): Promise<DataUpdateResult> => {
	await deleteOutlineDetailsGivenTime(id);
	return TimelineModal
		.destroy({
			where: { id }
		});
};
