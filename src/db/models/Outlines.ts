const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Outlines
const Outlines = sequelize.define(
	'outlines',
	{
		id: {
			field: 'id',
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		title: {
			field: 'title',
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: '标题不能为空'
				},
				notEmpty: {
					msg: '标题不能为空'
				},
				len: {
					args: [0, 10],
					msg: '标题应该在 10 个字之内！'
				}
			}
		},
		description: {
			field: 'description',
			type: Sequelize.STRING,
			defaultValue: '描述被吃了...',
			validate: {
				len: {
					args: [0, 100],
					msg: '描述应该在 100 个字之内！'
				}
			}
		},
		category_id: {
			field: 'category_id',
			type: Sequelize.INTEGER
		},
		category_title: {
			field: 'category_title',
			type: Sequelize.STRING
		},
		fav: {
			field: 'fav',
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		deleted: {
			field: 'deleted',
			type: Sequelize.INTEGER,
			defaultValue: 0
		}
	},
	{
		freezeTableName: true,
		timestamps: false
	}
);

export default Outlines;
