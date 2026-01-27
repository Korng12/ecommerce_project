'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromotionProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PromotionProduct.init({
    productId: DataTypes.INTEGER,
    promotionId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'promotionProducts',
    modelName: 'promotionProduct',
  });
  return PromotionProduct;
};