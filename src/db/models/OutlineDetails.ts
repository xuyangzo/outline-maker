const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for OutlineDetails
const OutlineDetail = sequelize.define(
	'outline_details',
	{
		id: {
			field: 'id',
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		outline_id: {
			field: 'outline_id',
			type: Sequelize.INTEGER
		},
		timeline: {
			field: 'timeline',
			type: Sequelize.STRING,
			validate: {
				notEmpty: {
					msg: '时间不能为空！'
				}
			}
		},
		content: {
			field: 'content',
			type: Sequelize.STRING,
			validate: {
				notEmpty: {
					msg: '内容不能为空！'
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

export default OutlineDetail;
