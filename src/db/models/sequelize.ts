const Sequelize = require('sequelize');
const path = require('path');

// distinguish dev mode from prod mode
const isDev = (process.mainModule || { filename: '' }).filename.indexOf('app.asar') === -1;
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
