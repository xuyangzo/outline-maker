const Sequelize = require('sequelize');
const path = require('path');

// distinguish dev mode from prod mode
const isDev = process.env.NODE_ENV !== 'production';
const dbPath = isDev ?
	'outline.sqlite' :
	path.join(__dirname, '../../../outline.sqlite');

const sequelize = new Sequelize(
	{
		dialect: 'sqlite',
		storage: dbPath,
		// disable logging for production
		logging: (str: string) => {
			if (isDev) console.log(str);
			else return;
		}
	}
);

export default sequelize;
