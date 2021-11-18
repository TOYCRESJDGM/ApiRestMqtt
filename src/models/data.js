'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Data.init({
    node: DataTypes.STRING,
    pm2: DataTypes.INTEGER,
    co: DataTypes.INTEGER,
    no2: DataTypes.INTEGER,
    latitude: DataTypes.DOUBLE,
    length: DataTypes.DOUBLE,
    zone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Data',
  });
  return Data;
};