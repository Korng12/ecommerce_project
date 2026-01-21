'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: adminPassword,  // hashed
        roleId: 1,
        email: 'admin@gmail.com',
        password: adminPassword,
        roleId: 1, // ADMIN
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user',
        password: customerPassword, // hashed
        roleId: 2,
        email: 'user@gmail.com',
        password: userPassword,
        roleId: 2, // USER
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@gmail.com', 'user@gmail.com']
    });
  }
};
