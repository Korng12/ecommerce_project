'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if roles already exist, if so, skip seeding
    const existingRoles = await queryInterface.rawSelect('roles', {
      where: {
        name: ['ADMIN', 'USER']
      }
    }, ['name']);
    
    if (existingRoles.length === 0) {
      await queryInterface.bulkInsert('roles', [
        {
          name: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'USER',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
