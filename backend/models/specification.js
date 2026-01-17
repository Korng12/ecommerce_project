'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class specification extends Model {
    static associate(models) {
      specification.belongsTo(models.product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  specification.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'specification',
    tableName: 'specifications'
  });
  return specification;
};