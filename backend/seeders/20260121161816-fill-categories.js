'use strict';

module.exports = {
  async up(queryInterface) {

    // Laptop (id = 1)
    await queryInterface.bulkUpdate(
      'categories',
      {
        description: 'High-performance laptops for work, school, and gaming.',
        image: '/images/categories/rog_strix_banner.jpg'
      },
      { id: 1 }
    );

    // SmartPhone (id = 2)
    await queryInterface.bulkUpdate(
      'categories',
      {
        description: 'Latest smartphones from top brands.',
        image: '/images/categories/iphone_16_pro_max_banner.jpg'
      },
      { id: 2 }
    );

    // Accessories (id = 3)
    await queryInterface.bulkUpdate(
      'categories',
      {
        description: 'Keyboard, mice, headphones, adapters.',
        image: '/images/categories/accessories_banner.jpg'
      },
      { id: 3 }
    );

    // Pc Hardware (id = 4)
    await queryInterface.bulkUpdate(
      'categories',
      {
        description: 'CPUs, GPUs, RAM, SSDs, motherboards, power supplies.',
        image: '/images/categories/component_banner.jpg'
      },
      { id: 4 }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate(
      'categories',
      {
        description: null,
        image: null
      },
      {}
    );
  }
};
