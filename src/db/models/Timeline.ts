const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Timeline
const Timeline = sequelize.define(
	'timelines',
	{
		id: {
			field: 'timeline_id',
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		outline_id: {
			field: 'outline_id',
			type: Sequelize.INTEGER
		},
		time: {
			field: 'time',
			type: Sequelize.STRING,
			validate: {
				notEmpty: {
					msg: '时间不能为空！'
				},
				len: {
					args: [0, 20],
					msg: '时间应该在 20 个字之内！'
				}
			}
		},
		createdAt: {
			field: 'created_at',
			type: Sequelize.DATE,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			field: 'updated_at',
			type: Sequelize.DATE,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
		}
	},
	{
		freezeTableName: true,
		timestamps: true
	}
);

export default Timeline;
