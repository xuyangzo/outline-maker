const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Trash
const Trash = sequelize.define(
	'trashes',
	{
		id: {
			field: 'trash_id',
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		novel_id: {
			field: 'novel_id',
			type: Sequelize.INTEGER
		},
		outline_id: {
			field: 'outline_id',
			type: Sequelize.INTEGER
		},
		character_id: {
			field: 'character_id',
			type: Sequelize.INTEGER
		},
		loc_id: {
			field: 'loc_id',
			type: Sequelize.INTEGER
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

export default Trash;
