const db = require('../models/index.js');
const Product = db.product;
const Category = db.category;
const Brand = db.brand;
const ProductImage = db.productImage;
const Specification = db.specification;

//=== GET ALL PRODUCTS ===
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'logo']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary']
        },
        {
          model: Specification,
          as: 'specifications',
          attributes: ['id', 'key', 'value']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// === GET SINGLE PRODUCT ===
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'logo', 'description']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary']
        },
        {
          model: Specification,
          as: 'specifications',
          attributes: ['id', 'key', 'value']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// === CREATE PRODUCT ===
const createProduct = async (req, res) => {
  try {
    const { name, description, stock, price, categoryId, brandId, images, specifications } = req.body;
    
    // Validation
    if (!name || !price || !categoryId) {
      return res.status(400).json({ 
        message: 'Name, price, and categoryId are required' 
      });
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Check if brand exists (if provided)
    if (brandId) {
      const brand = await Brand.findByPk(brandId);
      if (!brand) {
        return res.status(400).json({ message: 'Invalid brand' });
      }
    }

    // Create product
    const product = await Product.create({
        name,
        description: description || null,
        stock: Number(stock) || 0,
        price: Number(price),
        categoryId: Number(categoryId),
        brandId: brandId ? Number(brandId) : null
      });


    // Add images if provided
    if (images && Array.isArray(images)) {
      const imagePromises = images.map((image, index) => 
        ProductImage.create({
          productId: product.id,
          imageUrl: image.url,
          isPrimary: image.isPrimary || (index === 0) // First image is primary by default
        })
      );
      await Promise.all(imagePromises);
    }

    // Add specifications if provided
    if (specifications && Array.isArray(specifications)) {
      const specPromises = specifications.map(spec =>
        Specification.create({
          productId: product.id,
          key: spec.key,
          value: spec.value
        })
      );
      await Promise.all(specPromises);
    }

    // Return product with relations
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductImage, as: 'images' },
        { model: Specification, as: 'specifications' }
      ]
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// === UPDATE PRODUCT ===
const updateProduct = async (req, res) => {
  try {
    const { name, description, stock, price, categoryId, brandId } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if category exists
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    // Check if brand exists
    if (brandId) {
      const brand = await Brand.findByPk(brandId);
      if (!brand) {
        return res.status(400).json({ message: 'Invalid brand' });
      }
    }

    // Update product
    await product.update({
      name: name || product.name,
      description: description || product.description,
      stock: stock !== undefined ? stock : product.stock,
      price: price || product.price,
      categoryId: categoryId || product.categoryId,
      brandId: brandId !== undefined ? brandId : product.brandId
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===DELETE PRODUCT ===
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images and specifications first
    await ProductImage.destroy({ where: { productId: product.id } });
    await Specification.destroy({ where: { productId: product.id } });

    // Delete product
    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===GET PRODUCTS BY CATEGORY ===
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { categoryId: req.params.categoryId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name']
        }
      ]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==== GET PRODUCTS BY BRAND ===
const getProductsByBrand = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { brandId: req.params.brandId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name']
        }
      ]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==== ADD PRODUCT IMAGE ===
const addProductImage = async (req, res) => {
  try {
    const { productId, imageUrl, isPrimary } = req.body;

    if (!productId || !imageUrl) {
      return res.status(400).json({ message: 'productId and imageUrl are required' });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If this is primary, unset other primary images
    if (isPrimary) {
      await ProductImage.update(
        { isPrimary: false },
        { where: { productId } }
      );
    }

    const image = await ProductImage.create({
      productId,
      imageUrl,
      isPrimary: isPrimary || false
    });

    res.status(201).json(image);
  } catch (error) {
    console.error('Error adding product image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// === ADD PRODUCT SPECIFICATION ===
const addProductSpecification = async (req, res) => {
  try {
    const { productId, key, value } = req.body;

    if (!productId || !key || !value) {
      return res.status(400).json({ message: 'productId, key, and value are required' });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const specification = await Specification.create({
      productId,
      key,
      value
    });

    res.status(201).json(specification);
  } catch (error) {
    console.error('Error adding product specification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByBrand,
  addProductImage,
  addProductSpecification
};
