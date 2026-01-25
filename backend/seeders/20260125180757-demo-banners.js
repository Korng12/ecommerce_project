'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('banners', [
      {
        title: 'Big Sale 50%',
        image_url: 'banner-1.jpg',
        link: '/products',
        status: 'active',
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'New Arrivals',
        image_url: 'banner-2.jpg',
        link: '/new',
        status: 'active',
        position: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Clearance',
        image_url: 'banner-3.jpg',
        link: '/sale',
        status: 'inactive',
        position: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('banners', null, {})
  }
}
