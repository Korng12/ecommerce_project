const db = require("../models/index.js");
const { Op } = require("sequelize");
const Product = db.product;
const Category = db.category;
const Brand = db.brand;
const ProductImage = db.productImage;
const Specification = db.specification;

const LOW_STOCK_ALERT = 5;

//=== GET ALL PRODUCTS ===
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name", "logo"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "imageUrl", "isPrimary"],
        },
        {
          model: Specification,
          as: "specifications",
          attributes: ["id", "key", "value"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PRODUCT BY ID ================= */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"],
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name", "logo", "description"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "imageUrl", "isPrimary"],
        },
        {
          model: Specification,
          as: "specifications",
          attributes: ["id", "key", "value"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE PRODUCT ================= */
const createProduct = async (req, res) => {
  try {
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

    /* ✅ SAFE CATEGORY CHECK (NO description COLUMN USED) */
    const category = await Category.findByPk(categoryId, {
      attributes: ['id']
    });
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    /* ✅ SAFE BRAND CHECK (NO description COLUMN USED) */
    const parsedBrandId =
      brandId && String(brandId).trim() !== '' ? Number(brandId) : null;

    if (parsedBrandId) {
      const brand = await Brand.findByPk(parsedBrandId, {
        attributes: ['id']
      });
      if (!brand) {
        return res.status(400).json({ message: "Invalid brand" });
      }
    }

    /* ✅ CREATE PRODUCT */
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
        images.map((img, index) =>
          ProductImage.create({
            productId: product.id,
            imageUrl: img.url,
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

    /* ✅ RETURN CREATED PRODUCT */
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'logo'] },
        { model: ProductImage, as: 'images' },
        { model: Specification, as: 'specifications' }
      ]
    });

    res.status(201).json(createdProduct);
  } catch (err) {
    console.error('❌ CREATE PRODUCT ERROR:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ================= UPDATE PRODUCT ================= */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let {
      name,
      description,
      stock,
      price,
      categoryId,
      brandId
    } = req.body;

    categoryId = Number(categoryId);
    brandId =
      brandId && String(brandId).trim() !== '' ? Number(brandId) : null;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        message: 'Name, price, and categoryId are required'
      });
    }

    /* ✅ SAFE CHECKS */
    const category = await Category.findByPk(categoryId, { attributes: ['id'] });
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    if (brandId) {
      const brand = await Brand.findByPk(brandId, { attributes: ['id'] });
      if (!brand) {
        return res.status(400).json({ message: "Invalid brand" });
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

    /* ✅ IMAGE UPDATE */
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
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'logo'] },
        { model: ProductImage, as: 'images' },
        { model: Specification, as: 'specifications' }
      ]
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error('❌ UPDATE PRODUCT ERROR:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ================= DELETE PRODUCT ================= */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const specification = await Specification.create({
      productId,
      key,
      value,
    });

    res.status(201).json(specification);
  } catch (error) {
    console.error("Error adding product specification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// === LOW STOCK ALERTS ===
const getLowStockProducts = async (_req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "name", "stock", "updatedAt"],
      where: { stock: { [Op.lte]: LOW_STOCK_ALERT } },
      order: [["stock", "ASC"]],
    });

    return res.json({ threshold: LOW_STOCK_ALERT, products });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= EXPORT ================= */
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByBrand,
  addProductImage,
  addProductSpecification,
  getLowStockProducts,
  deleteProduct
};
