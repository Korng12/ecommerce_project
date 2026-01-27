'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.belongsTo(models.role, { 
        foreignKey: 'roleId',
        as: 'role'
      });
      user.belongsTo(models.role, { foreignKey: 'roleId' });
      user.hasMany(models.order, { foreignKey: 'userId', as: 'orders' });
      user.hasMany(models.cart, { foreignKey: 'userId', as: 'carts' });
    }
  }

  user.init(
    {
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      refreshToken: DataTypes.STRING(255)
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users'
    }
  );

  return user;
};