'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // define association here
      Promotion.belongsToMany(models.product, {
        through: 'promotionProduct',
        foreignKey: 'promotionId',
        as: 'products'
      });
    }
  }
  Promotion.init({
    name: DataTypes.STRING,
    type: DataTypes.ENUM('percentage','fixed'),
    value: DataTypes.DECIMAL,
    startDate: DataTypes.DATE,
    endDate: {
      type:DataTypes.DATE,
      allowNull: true,
      validate:{
        isAfterStartDate(value) {
          if (value && this.startDate && new Date(value) <= new Date(this.startDate)) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'promotions',
    modelName: 'promotion',
  });
  return Promotion;
};