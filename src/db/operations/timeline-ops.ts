import TimelineModal from '../models/Timeline';

// type declaration
import { TimelineDataValue } from '../../renderer/components/main/mainDec';

// get all timelines givend outline id
export const getAllTimelines = async (id: string | number): Promise<TimelineDataValue[]> => {
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
export const createTimeline = async (id: string | number, time: string): Promise<WriteDataModel> => {
	const timeline: DataModel = await TimelineModal
		.create({
			time,
			outline_id: id
		});

	const result: WriteDataModel = {
		type: 'create',
		tables: ['timeline'],
		success: false
	};
	if (timeline) {
		result.id = timeline.dataValues.id;
		result.success = true;
	}

	return result;
};

// update timeline
export const updateTimeline = async (id: string | number, time: string): Promise<WriteDataModel> => {
	const dataResults: DataUpdateResult = await TimelineModal
		.update(
			{ time },
			{ where: { id } }
		);

	const result: WriteDataModel = {
		type: 'update',
		tables: ['timeline'],
		success: false
	};
	if (dataResults && dataResults.length && dataResults[0] === 1) {
		result.success = true;
	}

	return result;
};

// delete timeline
export const deleteTimeline = async (id: string | number): Promise<WriteDataModel> => {
	const dataResult: DataDeleteResult = await TimelineModal
		.destroy({
			where: { id }
		});

	return {
		type: 'deleteP',
		tables: ['timeline'],
		success: dataResult === 1
	};
};
