const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Background
const Background = sequelize.define(
	'backgrounds',
	{
		id: {
			field: 'id',
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		novel_id: {
			field: 'novel_id',
			type: Sequelize.INTEGER
		},
		title: {
			field: 'title',
			type: Sequelize.STRING,
			validate: {
				notEmpty: {
					msg: '标签名不能为空！'
				},
				len: {
					args: [0, 20],
					msg: '标签名应该在 20 个字之内！'
				}
			}
		},
		content: {
			field: 'content',
			type: Sequelize.STRING,
			validate: {
				notEmpty: {
					msg: '内容不能为空！'
				},
				len: {
					args: [0, 500],
					msg: '标内容应该在 500 个字之内！'
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

export default Background;
