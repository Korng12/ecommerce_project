const db = require('../models/index.js');
const Product = db.product;
const Category = db.category;
const Brand = db.brand;
const ProductImage = db.productImage;
const Specification = db.specification;

/* ================= GET ALL PRODUCTS ================= */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'logo'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'imageUrl', 'isPrimary'] },
        { model: Specification, as: 'specifications', attributes: ['id', 'key', 'value'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= GET PRODUCT BY ID ================= */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductImage, as: 'images' },
        { model: Specification, as: 'specifications' }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= CREATE PRODUCT ================= */
const createProduct = async (req, res) => {
  try {
    console.log('📝 CREATE PRODUCT - BODY:', req.body);
    console.log('📝 CREATE PRODUCT - FILE:', req.file);

    const {
      name,
      description,
      stock,
      price,
      categoryId,
      brandId,
      images = [],
      specifications = []
    } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        message: 'Name, price, and categoryId are required'
      });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const parsedBrandId = brandId && String(brandId).trim() ? Number(brandId) : null;
    if (parsedBrandId) {
      const brand = await Brand.findByPk(parsedBrandId);
      if (!brand) {
        return res.status(400).json({ message: 'Invalid brand' });
      }
    }

    const product = await Product.create({
      name,
      description: description || null,
      stock: Number(stock) || 0,
      price: Number(price),
      categoryId: Number(categoryId),
      brandId: parsedBrandId
    });

    /* ✅ IMAGE FROM MULTER */
    if (req.file) {
      await ProductImage.create({
        productId: product.id,
        imageUrl: `/uploads/products/${req.file.filename}`,
        isPrimary: true
      });
    }

    /* ✅ IMAGE FROM JSON (OPTIONAL) */
    if (Array.isArray(images) && images.length > 0) {
      await Promise.all(
        images
          .filter(img => img && img.url)
          .map((img, index) =>
            ProductImage.create({
              productId: product.id,
              imageUrl: img.url.startsWith('http')
                ? img.url
                : `/uploads/products/${img.url}`,
              isPrimary: index === 0
            })
          )
      );
    }

    /* ✅ SPECIFICATIONS */
    if (Array.isArray(specifications)) {
      await Promise.all(
        specifications.map(spec =>
          Specification.create({
            productId: product.id,
            key: spec.key,
            value: spec.value
          })
        )
      );
    }

    /* 🔥 FIXED PART (NO STRING ALIASES) */
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductImage, as: 'images' },
        { model: Specification, as: 'specifications' }
      ]
    });

    res.status(201).json(createdProduct);
  } catch (err) {
    console.error('❌ CREATE PRODUCT ERROR:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

/* ================= UPDATE PRODUCT ================= */
const updateProduct = async (req, res) => {
  try {
    console.log('📝 UPDATE PRODUCT - BODY:', req.body);
    console.log('📝 UPDATE PRODUCT - FILE:', req.file);

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let {
      name,
      description,
      stock,
      price,
      categoryId,
      brandId
    } = req.body;

    // ✅ FIX EMPTY STRING & TYPE ISSUES
    categoryId = Number(categoryId);
    brandId =
      brandId && String(brandId).trim() !== ''
        ? Number(brandId)
        : null;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        message: 'Name, price, and categoryId are required'
      });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    if (brandId) {
      const brand = await Brand.findByPk(brandId);
      if (!brand) {
        return res.status(400).json({ message: 'Invalid brand' });
      }
    }

    await product.update({
      name,
      description: description || null,
      stock: Number(stock) || 0,
      price: Number(price),
      categoryId,
      brandId
    });

    // ✅ IMAGE UPDATE
    if (req.file) {
      await ProductImage.destroy({ where: { productId: product.id } });
      await ProductImage.create({
        productId: product.id,
        imageUrl: `/uploads/products/${req.file.filename}`,
        isPrimary: true
      });
    }

    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductImage, as: 'images' },
        { model: Specification, as: 'specifications' }
      ]
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error('❌ UPDATE PRODUCT ERROR:', err.message);
    console.error(err.stack);
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};


/* ================= DELETE PRODUCT ================= */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await ProductImage.destroy({ where: { productId: product.id } });
    await Specification.destroy({ where: { productId: product.id } });
    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= FILTER ================= */
const getProductsByCategory = async (req, res) => {
  const products = await Product.findAll({
    where: { categoryId: req.params.categoryId },
    include: [
      { model: Category, as: 'category' },
      { model: Brand, as: 'brand' }
    ]
  });
  res.json(products);
};

const getProductsByBrand = async (req, res) => {
  const products = await Product.findAll({
    where: { brandId: req.params.brandId },
    include: [
      { model: Category, as: 'category' },
      { model: Brand, as: 'brand' }
    ]
  });
  res.json(products);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByBrand
};
