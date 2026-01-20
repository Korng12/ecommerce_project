'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productImage extends Model {
    static associate(models) {
      productImage.belongsTo(models.product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  productImage.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'productImage',
    tableName: 'productImages'
  });
  return productImage;
};