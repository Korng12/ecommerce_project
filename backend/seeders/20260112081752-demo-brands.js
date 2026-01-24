'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('brands', [
      { name: 'Apple', logo: '/public/images/brands/apple-logo.png', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Samsung', logo: '/public/images/brands/samsung-logo.png', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Asus',  logo: '/public/images/brands/asus-logo.png', createdAt: new Date(), updatedAt: new Date() },
      { name: 'ROG',  logo: '/public/images/brands/rog-logo.png', createdAt: new Date(), updatedAt: new Date() },
      { name: 'MSI', logo: '/public/images/brands/msi-logo.png', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('brands', null, {});
  }
};