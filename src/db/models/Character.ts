const Sequelize = require('sequelize');
import sequelize from './sequelize';

// model for Character
const Character = sequelize.define(
	'characters',
	{
		id: {
			field: 'character_id',
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		outline_id: {
			field: 'outline_id',
			type: Sequelize.INTEGER
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
					msg: '角色姓名不能为空！'
				},
				len: {
					args: [0, 20],
					msg: '角色姓名应该在 20 个字之内！'
				}
			}
		},
		color: {
			field: 'color',
			type: Sequelize.STRING,
			defaultValue: 'white'
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

export default Character;
