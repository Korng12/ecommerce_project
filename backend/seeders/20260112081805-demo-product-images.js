'use strict';

const { truncate } = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('productImages', [
      { productId: 1, imageUrl: '/images/products/iphone-16promax-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, imageUrl: '/images/products/iphone-16promax-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, imageUrl: '/images/products/samsung-galaxy-s25-ultra-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, imageUrl: '/images/products/samsung-galaxy-s25-ultra-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, imageUrl: '/images/products/asus-rog-flow-z13-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, imageUrl: '/images/products/asus-rog-flow-z13-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, imageUrl: '/images/products/asus-vivobook-s16-oled-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, imageUrl: '/images/products/asus-vivobook-s16-oled-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, imageUrl: '/images/products/msi-cyborg-15-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, imageUrl: '/images/products/msi-cyborg-15-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, imageUrl: '/images/products/apple-macbook-pro-16-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, imageUrl: '/images/products/apple-macbook-pro-16-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 7, imageUrl: '/images/products/asus-rog-azoth.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 8, imageUrl: '/images/products/msi-mag-z890-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 9, imageUrl: '/images/products/asus-rog-strix-b760-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 9, imageUrl: '/images/products/asus-rog-strix-b760-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 10, imageUrl: '/images/products/asus-prime-rtx5080-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 10, imageUrl: '/images/products/asus-prime-rtx5080-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 11, imageUrl: '/images/products/msi-geforce-rtx4070-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() }, 
      { productId: 12, imageUrl: '/images/products/msi-geforce-rtx5090.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 13, imageUrl: '/images/products/Samsung-990-evo.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 14, imageUrl: '/images/products/asus-rog-strix-xg27aqm-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 14, imageUrl: '/images/products/asus-rog-strix-xg27aqm-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 15, imageUrl: '/images/products/msi-mag32cq-front.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: 15, imageUrl: '/images/products/msi-mag32cq-back.jpg', isPrimary: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: 16, imageUrl: '/images/products/apple-magic-keyboard-numeric-keypad.jpg', isPrimary: true, createdAt: new Date(), updatedAt: new Date() },

    ], {}); 
     
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('productImages', null, {
      truncate  : true,
      cascade   : true,
      restartIdentity: true
    });
  }
};