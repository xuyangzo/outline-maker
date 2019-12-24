const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Favorite
const Favorite = sequelize.define(
	'favorites',
	{
		id: {
			field: 'fav_id',
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		outline_id: {
			field: 'outline_id',
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

export default Favorite;
