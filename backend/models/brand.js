'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class brand extends Model {
    static associate(models) {
      brand.hasMany(models.product, {
        foreignKey: 'brandId',
        as: 'products'
      });
    }
  }
  brand.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    logo: DataTypes.STRING(255)
  }, {
    sequelize,
    modelName: 'brand',
    tableName: 'brands'
  });
  return brand;
};