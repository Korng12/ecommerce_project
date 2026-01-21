'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    static associate(models) {
      // define association here

      product.hasMany(models.cartItem, {
        foreignKey: 'productId'
      })

      product.hasMany(models.orderItem, {
        foreignKey: 'productId'
      })

      product.belongsTo(models.category, {
        foreignKey: 'category_id'
      })

    }
  }
  
  product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10,2),
    stock: DataTypes.INTEGER,
    image: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product',
    tableName: 'products'
  });
  
  return product;
};