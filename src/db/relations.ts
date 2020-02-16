import sequelize from './models/sequelize';
import BackgroundModel from './models/Background';
import CharacterModel from './models/Character';
import FavoriteModel from './models/Favorite';
import LocationModel from './models/Location';
import NovelModel from './models/Novels';
import OutlineDetailModel from './models/OutlineDetails';
import OutlineModel from './models/Outlines';
import TimelineModel from './models/Timeline';
import InventoryModel from './models/Inventories';
import TrashModel from './models/Trash';
import CharacterOutlineModel from './models/CharacterOutlines';

// foreign keys for novel model
NovelModel.hasMany(OutlineModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
NovelModel.hasMany(BackgroundModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
NovelModel.hasMany(CharacterModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
NovelModel.hasMany(LocationModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
NovelModel.hasMany(TrashModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for outline model
OutlineModel.hasMany(TimelineModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });
OutlineModel.hasMany(OutlineDetailModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });
OutlineModel.hasMany(FavoriteModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });
OutlineModel.hasMany(TrashModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });
OutlineModel.hasMany(CharacterOutlineModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });
OutlineModel.belongsTo(NovelModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for background model
BackgroundModel.belongsTo(NovelModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for character model
CharacterModel.hasMany(OutlineDetailModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
CharacterModel.hasMany(TrashModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
CharacterModel.hasMany(CharacterOutlineModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
CharacterModel.hasMany(InventoryModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
CharacterModel.belongsTo(NovelModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for location model
LocationModel.hasMany(TrashModel, { foreignKey: 'loc_id', onDelete: 'CASCADE', constraints: true });
LocationModel.belongsTo(NovelModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for timeline model
TimelineModel.hasMany(OutlineDetailModel, { foreignKey: 'timeline_id', onDelete: 'CASCADE', constraints: true });
TimelineModel.belongsTo(OutlineModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for outline_detail model
OutlineDetailModel.belongsTo(OutlineModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });
OutlineDetailModel.belongsTo(CharacterModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
OutlineDetailModel.belongsTo(TimelineModel, { foreignKey: 'timeline_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for favorite model
FavoriteModel.belongsTo(OutlineModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for trash model
TrashModel.belongsTo(CharacterModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
TrashModel.belongsTo(LocationModel, { foreignKey: 'loc_id', onDelete: 'CASCADE', constraints: true });
TrashModel.belongsTo(NovelModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
TrashModel.belongsTo(OutlineModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for character_outlines model
CharacterOutlineModel.belongsTo(CharacterModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
CharacterOutlineModel.belongsTo(OutlineModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for inventories model
InventoryModel.belongsTo(CharacterModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });

/**
 * enable the following only in development mode
 * in order to create base data for testing
 * in production mode, database has already been synced
 */
(async function () {
	await sequelize
		.sync({ force: true })
		.then(async () => {
			await NovelModel.create({
				name: '豪门特种兵之孤胆贼王',
				description: `三年前，他为了一个女人闯下大祸，被迫服役三年。
				三年后，他王者归来，这个女人却已转投仇人怀抱，最好的兄弟也因此家破人亡。
				这一生很简单，天在上地在下，兄弟在心中，爱人在怀中，便足矣。
				这一生不简单，神挡杀神，佛挡杀佛，我愿屠尽三千世界，让这天下再无可阻我之物！`,
				categories: '豪门,孤儿,盗贼,特种兵'
			});

			await OutlineModel.create({
				title: '第一卷 刘姥姥初试云雨情',
				description: `书中自有颜如玉，书中自有黄金屋。
				一旦学有所成，便能朝为田舍郎，暮登天子堂。
				韩四不通经史，不谙子集，无缘科举，想光宗耀祖，只能去捐一个官！`,
				novel_id: 1,
				scaling: 0.75,
				fav: 0,
				delete: 0,
				novelPageOrder: 1
			});
			await OutlineModel.create({
				title: '第二卷 贾宝玉倒拔垂杨柳',
				description: '默认介绍',
				novel_id: 1,
				scaling: 0.75,
				fav: 0,
				delete: 0,
				novelPageOrder: 2
			});

			await BackgroundModel.create({
				novel_id: 1,
				title: '世界观',
				content: `1. 在这个世界里，所有女人看见主角都会发情，并且实力越强的女人，发情越严重
			2. 在这个世界里，所有反派的智商都为60，包括大boss
			3. 在这个世界里，所有主角身边的人智商都为20，包括女主
			4. 不是现实世界，不要对号入座`
			});

			await BackgroundModel.create({
				novel_id: 1,
				title: '圣者',
				content: `每一代圣者都是1男（领导者）+ 4女（后宫），仅仅这一个万年时代有，为了拯救世界
			每隔 1000 年，四大圣树便会重获新生，并且会有一代圣者诞生，故事开始是第九代圣者
			每一代圣者大概都只存在了十年，然后四位女性便再次化作了圣树的种子，男性则是暴毙
			圣者诞生的目的就是为了对抗破灭天魔，虽然也顺便处理过一些别的魂兽（如玛丽雷基）`
			});

			await LocationModel.create({
				novel_id: 1,
				name: '天之塔',
				intro: '三大世界的最高统治者，并且是所有种族的最高统治者',
				texture: '一座纯白的塔',
				location: '第一世界中央',
				controller: '天尊',
				deleted: 0,
				novelPageOrder: 1
			});
			await LocationModel.create({
				novel_id: 1,
				name: '天之塔2',
				intro: '三大世界的最高统治者，并且是所有种族的最高统治者',
				texture: '一座纯白的塔',
				location: '第一世界中央',
				controller: '天尊',
				deleted: 0,
				novelPageOrder: 2
			});
			await LocationModel.create({
				novel_id: 1,
				name: '天之塔3',
				novelPageOrder: 3
			});

			await CharacterModel.create({
				novel_id: 1,
				name: '大佬',
				color: '#ffa39e',
				age: '18',
				nickname: '老狗',
				gender: 0,
				height: '178',
				identity: '世界树的传人',
				appearance: `1.丑
				2. 不知道咋说
				3. jj还小`,
				characteristics: '高傲',
				experience: '啥都没有',
				note: '没别的，就是个傻子',
				deleted: 0,
				isMain: 1,
				novelPageOrder: 1
			});
			await CharacterModel.create({
				novel_id: 1,
				name: '菜比',
				color: '#ffbb96',
				deleted: 0,
				isMain: 1,
				novelPageOrder: 2
			});
			await CharacterModel.create({
				novel_id: 1,
				name: '菜比2',
				color: '#ffbb96',
				deleted: 0,
				novelPageOrder: 3
			});
			await CharacterModel.create({
				novel_id: 1,
				name: '菜比3',
				color: '#ffbb96',
				deleted: 0,
				novelPageOrder: 4
			});

			await CharacterOutlineModel.create({
				character_id: 1,
				outline_id: 1
			});
			await CharacterOutlineModel.create({
				character_id: 1,
				outline_id: 2
			});
			await CharacterOutlineModel.create({
				character_id: 3,
				outline_id: 1
			});
			await CharacterOutlineModel.create({
				character_id: 4,
				outline_id: 2
			});

			await TimelineModel.create({
				outline_id: 1,
				time: '1990年'
			});

			await TimelineModel.create({
				outline_id: 1,
				time: '1991年'
			});

			await TimelineModel.create({
				outline_id: 1,
				time: '1992年'
			});

			await OutlineDetailModel.create({
				outline_id: 1,
				timeline_id: 1,
				character_id: 1,
				content: '我杀人了'
			});

			await OutlineDetailModel.create({
				outline_id: 1,
				timeline_id: 1,
				character_id: 2,
				content: '我出轨了'
			});

			await OutlineDetailModel.create({
				outline_id: 1,
				timeline_id: 2,
				character_id: 1,
				content: '我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了'
			});

			await OutlineDetailModel.create({
				outline_id: 1,
				timeline_id: 3,
				character_id: 2,
				content: '我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了我又出轨了'
			});
		});
}());
