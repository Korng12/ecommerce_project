'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
      });

      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
      });
    }
  }

  Cart.init(
    {
      userId: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'carts',
    }
  );

  return Cart;
};
