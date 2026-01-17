'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.belongsTo(models.role, { foreignKey: 'roleId' });
    }
  }

  user.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      gender: DataTypes.ENUM('male', 'female', 'other')
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users'
    }
  );

  return user;
};
