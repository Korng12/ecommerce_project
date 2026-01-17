const { product, category } = require('../models');

module.exports = {
  // GET ALL PRODUCTS
  async getAll() {
    return await product.findAll({
      include: {
        model: category,
        attributes: ['id', 'name']
      },
      order: [['createdAt', 'DESC']]
    });
  },

  // CREATE PRODUCT
  async create(data) {
    return await product.create(data);
  },

  // UPDATE PRODUCT
  async update(id, data) {
    const p = await product.findByPk(id);
    if (!p) throw new Error('Product not found');
    return await p.update(data);
  },

  // DELETE PRODUCT
  async remove(id) {
    const p = await product.findByPk(id);
    if (!p) throw new Error('Product not found');
    await p.destroy();
  }
};
