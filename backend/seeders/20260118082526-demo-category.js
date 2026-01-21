'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Laptops',
        description: 'Laptops for work, study, and gaming',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Desktop Computers',
        description: 'Desktop PCs for office and gaming',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Smartphones',
        description: 'Android and iOS smartphones',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mobile Accessories',
        description: 'Chargers, power banks, earphones, cases',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
