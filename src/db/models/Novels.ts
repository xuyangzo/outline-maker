const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Character
const Novel = sequelize.define(
	'novels',
	{
		id: {
			field: 'id',
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		name: {
			field: 'name',
			type: Sequelize.STRING,
			validate: {
				notEmpty: {
					msg: '小说名字不能为空！'
				},
				len: {
					args: [0, 12],
					msg: '小说名字应该在 12 个字之内！'
				}
			}
		},
		description: {
			field: 'description',
			type: Sequelize.STRING,
			defaultValue: '描述被作者吃了...',
			validate: {
				len: {
					args: [0, 150],
					msg: '描述应该在 150 个字之内！'
				}
			}
		},
		categories: {
			field: 'categories',
			type: Sequelize.STRING,
			defaultValue: ''
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

export default Novel;
