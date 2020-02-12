// decalre image as module to prevent syntax error during import
declare module '*.png';
declare module '*.jpg';

// general template for result retrieved from database with sequelize
interface DataModel {
  dataValues: any;
  _previousDataValues: Object;
  isNewRecord: boolean;
  _changed: Object;
  _modelOptions: Object;
  _options: Object;
}

type DataResult = DataModel | null;