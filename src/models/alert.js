'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Data,{ foreignKey: 'origin_fk', as: 'origen'});
    }
  };
  Alert.init({
    node: DataTypes.STRING,
    type: DataTypes.STRING,
    ica: DataTypes.FLOAT,
    description: DataTypes.STRING,
    zone: DataTypes.STRING,
    origin_fk: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Alert',
  });
  return Alert;
};