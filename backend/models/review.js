'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      review.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
      review.belongsTo(models.product, { foreignKey: 'productId', as: 'product' });
    }
  }
  review.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    rating: DataTypes.DECIMAL(2,1),
    comment: DataTypes.TEXT
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId']
      }
    ],
    sequelize,
    modelName: 'review',
  });
  return review;
};