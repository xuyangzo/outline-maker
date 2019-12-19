// image
import shadowMan from '../../public/shadow-person.jpg';
import shadowGirl from '../../public/shadow-girl.jpg';
import shadowNone from '../../public/shadow-none.png';
import shadowBoth from '../../public/shadow-both.jpg';

export const colors = [
	'#ffa39e', // light dust red
	'#ffbb96', // orange
	'#ffe7ba', // light orange
	'#fff1b8', // light gold
	'#d9f7be', // light green
	'#b5f5ec', // light cyan
	'#bae7ff', // light blue
	'#efdbff', // light purple
	'#ffd6e7', // light pink
	'#e8e8e8'  // light gray
];

export const tagColors = [
	'#ff4d4f', // medium dust red,
	'#40a9ff', // medium blue
	'#9254de', // medium purple
	'#73d13d'  // medium green
];

export const imageMapping: { [key: string]: string } = {
	0: shadowMan,
	1: shadowGirl,
	2: shadowNone,
	3: shadowBoth
};

export const tags = [
	'豪门', '孤儿', '盗贼', '特工', '黑客', '明星', '特种兵', '杀手',
	'老师', '学生', '胖子', '宠物', '蜀山', '魔王附体', 'LOL', '废材流',
	'护短', '卡片', '手游', '法师', '医生', '感情', '鉴宝', '亡灵',
	'职场', '吸血鬼', '龙', '西游', '鬼怪', '阵法', '魔兽', '勇猛',
	'玄学', '群穿', '丹药', '练功流', '召唤流', '恶搞', '爆笑', '轻松',
	'冷酷', '腹黑', '阳光', '狡猾', '机智', '猥琐', '嚣张', '淡定',
	'僵尸', '丧尸', '盗墓', '随身流', '软饭流', '无敌文', '异兽流',
	'系统流', '洪荒流', '学院流', '位面', '铁血', '励志', '坚毅', '变身',
	'强者回归', '赚钱', '争霸流', '种田文', '宅男', '无限流', '技术流',
	'凡人流', '热血', '重生', '穿越'
];
