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
			type: Sequelize.STRING
		},
		description: {
			field: 'description',
			type: Sequelize.STRING
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
