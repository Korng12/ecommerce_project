const db = require("../models");
const { Op } = require("sequelize");

const Product = db.product;
const Category = db.category;
const Brand = db.brand;
const ProductImage = db.productImage;
const Specification = db.specification;

const LOW_STOCK_ALERT = 5;

/* ================= GET ALL PRODUCTS ================= */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name", "logo"] },
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
  } catch (err) {
    console.error("❌ FETCH PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PRODUCT BY ID ================= */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name", "logo"] },
        { model: ProductImage, as: "images" },
        { model: Specification, as: "specifications" },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ FETCH PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE PRODUCT ================= */
const createProduct = async (req, res) => {
  try {
    const { name, description, stock, price, categoryId, brandId } = req.body;

    /* ===== VALIDATION ===== */
    if (!name || price == null || !categoryId) {
      return res.status(400).json({
        message: "Name, price, and category are required",
      });
    }

    /* ===== CATEGORY CHECK ===== */
    const category = await Category.findByPk(Number(categoryId), {
      attributes: ["id"],
    });
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    /* ===== BRAND CHECK (OPTIONAL) ===== */
    const parsedBrandId =
      brandId && String(brandId).trim() !== "" ? Number(brandId) : null;

    if (parsedBrandId) {
      const brand = await Brand.findByPk(parsedBrandId, {
        attributes: ["id"],
      });
      if (!brand) {
        return res.status(400).json({ message: "Invalid brand" });
      }
    }

    /* ===== CREATE PRODUCT ===== */
    const product = await Product.create({
      name,
      description: description || null,
      stock: Number(stock) || 0,
      price: Number(price),
      categoryId: Number(categoryId),
      brandId: parsedBrandId,
    });

    /* ===== IMAGE (MULTER) ===== */
    if (req.file) {
      await ProductImage.create({
        productId: product.id,
        imageUrl: req.file.filename, // ✅ filename only
        isPrimary: true,
      });
    }

    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name", "logo"] },
        { model: ProductImage, as: "images" },
      ],
    });

    res.status(201).json(createdProduct);
  } catch (err) {
    console.error("❌ CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Create product failed",
      error: err.message,
    });
  }
};

/* ================= UPDATE PRODUCT ================= */
const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, stock, price, categoryId, brandId } = req.body;

    if (!name || price == null || !categoryId) {
      return res.status(400).json({
        message: "Name, price, and category are required",
      });
    }

    const category = await Category.findByPk(Number(categoryId), {
      attributes: ["id"],
    });
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const parsedBrandId =
      brandId && String(brandId).trim() !== "" ? Number(brandId) : null;

    if (parsedBrandId) {
      const brand = await Brand.findByPk(parsedBrandId, {
        attributes: ["id"],
      });
      if (!brand) {
        return res.status(400).json({ message: "Invalid brand" });
      }
    }

    await product.update({
      name,
      description: description || null,
      stock: Number(stock) || 0,
      price: Number(price),
      categoryId: Number(categoryId),
      brandId: parsedBrandId,
    });

    /* ===== IMAGE UPDATE ===== */
    if (req.file) {
      console.log("📸 IMAGE FILE RECEIVED:", req.file);
      await ProductImage.destroy({ where: { productId } });
      await ProductImage.create({
        productId,
        imageUrl: req.file.filename, // ✅ filename only
        isPrimary: true,
      });
      console.log("✅ IMAGE SAVED - Filename:", req.file.filename);
    } else {
      console.log("⚠️ NO IMAGE FILE RECEIVED IN UPDATE");
    }

    const updatedProduct = await Product.findByPk(productId, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name", "logo"] },
        { model: ProductImage, as: "images" },
        { model: Specification, as: "specifications" },
      ],
    });

    console.log("📦 UPDATED PRODUCT RESPONSE:", JSON.stringify(updatedProduct, null, 2));
    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

/* ================= DELETE PRODUCT ================= */
const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Specification.destroy({ where: { productId } });
    await ProductImage.destroy({ where: { productId } });
    await Product.destroy({ where: { id: productId } });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

/* ================= LOW STOCK ================= */
const getLowStockProducts = async (_req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "name", "stock", "updatedAt"],
      where: { stock: { [Op.lte]: LOW_STOCK_ALERT } },
      order: [["stock", "ASC"]],
    });

    res.json({ threshold: LOW_STOCK_ALERT, products });
  } catch (err) {
    console.error("❌ LOW STOCK ERROR:", err);
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
  getLowStockProducts,
};
