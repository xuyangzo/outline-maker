import TimelineModal from '../models/Timeline';

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
