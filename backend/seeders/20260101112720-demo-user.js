'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate hashed passwords
    const adminPassword = await bcrypt.hash('admin123', 10);   // 10 = salt rounds
    const customerPassword = await bcrypt.hash('user123', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: adminPassword,  // hashed
        roleId: 1,
        email: 'admin@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user',
        password: customerPassword, // hashed
        roleId: 2,
        email: 'user@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      username: ['admin', 'customer']
    });
  }
};
