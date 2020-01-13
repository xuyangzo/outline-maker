import TimelineModal from '../models/Timeline';
import { deleteOutlineDetailsGivenTime } from './detail-ops';

// get all timelines givend outline id
export const getAllTimelines = (id: string): Promise<any> => {
	return TimelineModal
		.findAll({
			where: {
				outline_id: id
			}
		});
};

// create new timeline
export const createTimeline = (id: string, time: string): Promise<any> => {
	return TimelineModal
		.create({
			time,
			outline_id: id
		});
};

// update timeline
export const updateTimeline = (id: string | number, time: string): Promise<any> => {
	return TimelineModal
		.update(
			{ time },
			{ where: { id } }
		);
};

// delete timeline
export const deleteTimeline = async (id: string | number): Promise<any> => {
	await deleteOutlineDetailsGivenTime(id);
	return TimelineModal
		.destroy({
			where: { id }
		});
};
