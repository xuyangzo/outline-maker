// decalre image as module to prevent syntax error during import
declare module '*.png';
declare module '*.jpg';

// declare DatabaseError to be global
declare type DatabaseError = import('sequelize').DatabaseError;

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
type DataResults = DataModel[];

interface WriteDataModel {
  type: 'update' | 'create' | 'deleteT' | 'deleteP' | 'back' | 'helper' | 'mixed';
  tables: string[];
  success: boolean;
  id?: number;
}

type DataUpdateResult = number[];
type DataUpdateResults = DataUpdateResult[];

type DataDeleteResult = number;
type DataDeleteResults = number[];