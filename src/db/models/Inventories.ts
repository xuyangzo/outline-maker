const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Inventories
const Inventories = sequelize.define(
	'inventories',
	{
		id: {
			field: 'inventory_id',
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		novel_id: {
			field: 'novel_id',
			type: Sequelize.INTEGER
		},
		character_id: {
			field: 'character_id',
			type: Sequelize.INTEGER
		},
		name: {
			field: 'name',
			type: Sequelize.STRING,
			validate: {
				notEmpty: {
					msg: '道具名字不能为空！'
				},
				len: {
					args: [0, 20],
					msg: '道具名字应该在 20 个字之内！'
				}
			}
		},
		description: {
			field: 'description',
			type: Sequelize.INTEGER
		},
		image: {
			field: 'image',
			type: Sequelize.STRING
		},
		category: {
			field: 'category',
			type: Sequelize.STRING
		},
		deleted: {
			field: 'deleted',
			type: Sequelize.INTEGER,
			default: 0
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

export default Inventories;
