const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Character-Inventory relation table
const CharacterInventories = sequelize.define(
	'character_inventories',
	{
		id: {
			field: 'id',
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		inventory_id: {
			field: 'inventory_id',
			type: Sequelize.INTEGER
		},
		character_id: {
			field: 'character_id',
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

export default CharacterInventories;
