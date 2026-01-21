'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'MacBook Pro M2',
        description: 'Apple MacBook Pro with M2 chip',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        stock: 5,
        price: 1999.99,
        categoryId: 1, // Laptops (must exist)
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-thin Dell laptop for professionals',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7',
        stock: 8,
        price: 1499.99,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Apple flagship smartphone',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        stock: 12,
        price: 1299.00,
        categoryId: 3, // Smartphones
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Samsung high-end Android phone',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34f3b1e4b3',
        stock: 15,
        price: 1099.00,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
