const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Location
const Location = sequelize.define(
	'locations',
	{
		id: {
			field: 'loc_id',
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		novel_id: {
			field: 'novel_id',
			type: Sequelize.INTEGER
		},
		name: {
			field: 'name',
			type: Sequelize.STRING,
			validate: {
				notEmpty: {
					msg: '势力姓名不能为空！'
				},
				len: {
					args: [0, 20],
					msg: '势力姓名应该在 20 个字之内！'
				}
			}
		},
		image: {
			field: 'image',
			type: Sequelize.STRING,
		},
		intro: {
			field: 'intro',
			type: Sequelize.STRING,
			defaultValue: '介绍找不到了...'
		},
		texture: {
			field: 'texture',
			type: Sequelize.STRING
		},
		location: {
			field: 'location',
			type: Sequelize.STRING
		},
		controller: {
			field: 'controller',
			type: Sequelize.STRING
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

export default Location;
