const { Product, Category } = require('../models')

module.exports = {
  async getAll() {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    // ✅ MATCH FRONTEND EXPECTATION
    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      description: p.description,
      imageUrl: p.image_url || null,
      category: p.Category ? p.Category.name : '',
      sku: `SKU-${p.id}`,
    }))
  },

  async create(data) {
    return await Product.create(data)
  },

  async update(id, data) {
    const p = await Product.findByPk(id)
    if (!p) throw new Error('Product not found')
    return await p.update(data)
  },

  async remove(id) {
    const p = await Product.findByPk(id)
    if (!p) throw new Error('Product not found')
    await p.destroy()
  },
}
