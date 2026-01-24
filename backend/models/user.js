'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.belongsTo(models.role, { foreignKey: 'roleId' });
      user.hasMany(models.order, { foreignKey: 'userId', as: 'orders' });
      user.hasMany(models.cart, { foreignKey: 'userId', as: 'carts' });
    }
  }

  user.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
     
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users'
    }
  );

  return user;
};
