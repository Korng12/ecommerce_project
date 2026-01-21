'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      { name: 'Laptop',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'SmartPhone',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Peripheral', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pc Hardware', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};