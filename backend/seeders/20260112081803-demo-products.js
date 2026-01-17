'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'iPhone 16 ProMAx',
        description: 'Latest Apple smartphone',
        stock: 50,
        price: 1199.99,
        categoryId: 2,
        brandId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung Galaxy S25 Ultra',
        description: 'Android flagship phone',
        stock: 75,
        price: 999.99,
        categoryId: 2,
        brandId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Asus ROG Flow Z13',
        description: 'Gaming laptop with detachable screen',
        stock: 20,
        price: 2299.99,
        categoryId: 1,
        brandId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Asus VivoBook S16 OLED',
        description: 'Sleek laptop with OLED display',
        stock: 30,
        price: 899.99,
        categoryId: 1,
        brandId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MSI Cyborg 15',
        description: 'High-performance gaming laptop',
        stock: 25,
        price: 999.99,
        categoryId: 1,
        brandId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
      name: 'Apple MacBook Pro 16',
        description: 'Powerful laptop for professionals',
        stock: 15,
        price: 2499.99,
        categoryId: 1,
        brandId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'Asus ROG Azoth x Wireless Mechanical Keyboard',
        description: 'High-end wireless mechanical keyboard',
        stock: 100,
        price: 279.99,
        categoryId: 3,
        brandId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name : 'MSI MAG  Z890 TOMAHAWK WIFI DDR4',
        description: 'Durable motherboard with advanced features',
        stock: 40,
        price: 369.99,
        categoryId: 4,
        brandId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'Asus ROG STRIX B760-A GAMING WIFI DDR5',
        description: 'High-performance motherboard for gaming',
        stock: 35,
        price: 299.99,
        categoryId: 4,
        brandId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'Asus PRIME-RTX5080-O16GB-V2-GAMING',
        description: 'Powerful graphics card for gaming and creative work',
        stock: 60,
        price: 1389.99,
        categoryId: 4,
        brandId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'MSI GeForce RTX 4070 Ti GAMING X TRIO 12G',
        description: 'High-end graphics card for gaming enthusiasts',
        stock: 55,
        price: 899.99,
        categoryId: 4,
        brandId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'MSI GeForce RTX 5090 32G VANGUARD SOC(LE)',
        description: 'Top-tier graphics card for ultimate performance',
        stock: 20,
        price: 3699.99,
        categoryId: 4,
        brandId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'Samsung 990 Evo 2TB NVMe M.2 SSD',
        description: 'High-speed solid state drive for fast data access',
        stock: 80,
        price: 199.99,
        categoryId: 4,
        brandId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'Asus ROG Strix XG27AQ 27" Gaming Monitor',
        description: 'High-refresh-rate monitor for smooth gaming experience',
        stock: 45,
        price: 264.99,
        categoryId: 3,
        brandId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'MSI MAG 32CQ4 32" Curved Gaming Monitor',
        description: 'Immersive curved monitor for gaming',
        stock: 50,
        price: 269.99,
        categoryId: 3,
        brandId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:'Apple Magic Keyboard with Numeric Keypad',
        description: 'Sleek keyboard designed for Mac users',
        stock: 120,
        price: 149.99,
        categoryId: 3,
        brandId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ], {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  }
};