const notifier = require('node-notifier');
const path = require('path');

const notifyResetDB = () => {
	notifier.notify(
		{
			title: '重置提醒',
			icon: path.join(__dirname, '../../public/empty-character.png'),
			message: '数据库重置成功！',
			sound: 'Glass',
			timeout: 3
		}
	);
};

export { notifyResetDB };
