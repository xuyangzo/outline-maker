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

// map images for characters
export const imageMapping: { [key: string]: string } = {
	0: shadowMan,
	1: shadowGirl,
	2: shadowNone,
	3: shadowBoth
};

// map gender text
export const mapGenderText = (gender: number | undefined): string => {
	if (!gender) return '男';

	let genderText: string = '';
	switch (gender) {
		case 0:
			genderText = '男';
			break;
		case 1:
			genderText = '女';
			break;
		case 2:
			genderText = '不明';
			break;
		case 3:
			genderText = '大雕萌妹';
			break;
		default:
			break;
	}
	return genderText;
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

export const inventoryCategories = [
	'功法', '法宝', '丹药', '草药', '魔兽', '装备', '材料', '招式', '技能'
];

interface BackgroundIllustrations {
	worldview: string;
	levelSystem: string;
	currencySystem: string;
}

// illustration texts for background properties
export const backgroundIllustrations: BackgroundIllustrations = {
	worldview: '世界整体的设定，包含但不限于：\n\n1. 存在的种族\n2. 不同的地图\n3. 基础规则\n4. 生产力规则',
	levelSystem: '战斗的等级体系。\n\n比如大斗师、斗皇、斗圣等等。',
	currencySystem: '世界的货币体系。主要有：\n\n1. 不同货币的兑换比例\n2. 不同货币的购买力\n\n提前设置好可以避免写脱。'
};

interface LocationIllustrations {
	intro: string;
	texture: string;
}

const introHelper: string = '1. 该势力的地位\n2. 该势力的成员\n3. 该势力的特点\n';
const introHelper2: string = '4. 该势力的人文环境';

// illustration texts for location properties
export const locationIllustrations: LocationIllustrations = {
	intro: '包括了对于该势力的介绍，包含但不局限以下内容：\n\n'.concat(introHelper, introHelper2),
	texture: '包含了对于该势力外观的描述：\n\n比如说建筑的模样，自然景观等等'
};

interface CharacterIllustrations {
	nickname: string;
	identity: string;
	appearance: string;
	characteristics: string;
	experience: string;
	outlines: string;
	inventories: string;
}

const characteristicsHelper: string = '例如：”性格胆小，害怕与别人交流，害怕任何眼神接触。“';

// illustration texts for character properties
export const characterIllustrations: CharacterIllustrations = {
	nickname: '平时别人是怎么称呼ta的。\n\n比如说：老大、龙哥，等等\n\n不一定只有一个。',
	identity: '明面 + 隐藏的身份。\n\n明面身份比如：大家族的弟子\n隐藏身份比如：远古血脉传承者\n\n可以有多个。',
	appearance: '包含但不限于以下要素：\n\n1. 发型\n2. 外貌\n3. 气质\n4. 衣着\n5. 身材',
	characteristics: '建议用较长的句子描述，\n而不是仅仅使用词语来形容。\n\n'.concat(characteristicsHelper),
	experience: '该角色在出场之前的经历是什么。\n\n不一定需要写得很长，但这玩意儿对于角色性格和剧情推动的作用很重要。',
	outlines: '该角色所属的大纲（可以有多个）',
	inventories: '属于该角色的道具（同时也可以属于别人）'
};
