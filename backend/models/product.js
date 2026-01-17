'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    static associate(models) {
      product.belongsTo(models.category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
      
      product.belongsTo(models.brand, {
        foreignKey: 'brandId',
        as: 'brand'
      });
      
      product.hasMany(models.productImage, {
        foreignKey: 'productId',
        as: 'images'
      });
      
      product.hasMany(models.specification, {
        foreignKey: 'productId',
        as: 'specifications'
      });
      
      product.hasMany(models.cartItem, {
        foreignKey: 'productId',
        as: 'cartItems'
      });
      
      product.hasMany(models.orderItem, {
        foreignKey: 'productId',
        as: 'orderItems'
      });
    }
  }
  
  product.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'product',
    tableName: 'products'
  });
  
  return product;
};