const Sequelize = require('sequelize');
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'src/db/outline.sqlite'
});

export default sequelize;
