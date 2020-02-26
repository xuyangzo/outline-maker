import sequelize from '../../db/models/sequelize';
import BackgroundModel from '../../db/models/Background';
import CharacterModel from '../../db/models/Character';
import FavoriteModel from '../../db/models/Favorite';
import LocationModel from '../../db/models/Location';
import NovelModel from '../../db/models/Novels';
import OutlineDetailModel from '../../db/models/OutlineDetails';
import OutlineModel from '../../db/models/Outlines';
import TimelineModel from '../../db/models/Timeline';
import InventoryModel from '../../db/models/Inventories';
import TrashModel from '../../db/models/Trash';
import CharacterOutlineModel from '../../db/models/CharacterOutlines';
import CharacterInventoryModel from '../../db/models/CharacterInventories';

// foreign keys for novel model
NovelModel.hasMany(OutlineModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
NovelModel.hasMany(BackgroundModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
NovelModel.hasMany(CharacterModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
NovelModel.hasMany(LocationModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
NovelModel.hasMany(InventoryModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });
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
CharacterModel.hasMany(CharacterInventoryModel, { foreignKey: 'inventory_id', onDelete: 'CASCADE', constraints: true });
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
TrashModel.belongsTo(InventoryModel, { foreignKey: 'inventory_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for character_outlines model
CharacterOutlineModel.belongsTo(CharacterModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
CharacterOutlineModel.belongsTo(OutlineModel, { foreignKey: 'outline_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for inventories model
InventoryModel.hasMany(TrashModel, { foreignKey: 'inventory_id', onDelete: 'CASCADE', constraints: true });
InventoryModel.hasMany(CharacterInventoryModel, { foreignKey: 'inventory_id', onDelete: 'CASCADE', constraints: true });
InventoryModel.belongsTo(NovelModel, { foreignKey: 'novel_id', onDelete: 'CASCADE', constraints: true });

// foreign keys for character_inventory model
CharacterInventoryModel
	.belongsTo(CharacterModel, { foreignKey: 'character_id', onDelete: 'CASCADE', constraints: true });
CharacterInventoryModel
	.belongsTo(InventoryModel, { foreignKey: 'inventory_id', onDelete: 'CASCADE', constraints: true });

// reset database
export const resetDatabase = (): Promise<any> => {
	return sequelize.sync({ force: true });
};
