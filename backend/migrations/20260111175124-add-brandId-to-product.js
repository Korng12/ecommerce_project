'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'brandId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'brands',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'brandId');
  }
};