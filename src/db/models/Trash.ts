const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Trash
const Trash = sequelize.define(
	'outline_details',
	{
		id: {
			field: 'trash_id',
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		outline_id: {
			field: 'outline_id',
			type: Sequelize.INTEGER
		},
		title: {
			field: 'outline_title',
			type: Sequelize.STRING
		}
	}
);

export default Trash;
