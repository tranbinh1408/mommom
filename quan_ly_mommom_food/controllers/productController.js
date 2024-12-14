const Product = require('../models/productModel');

const productController = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách sản phẩm',
        error: error.message
      });
    }
  },

  // Lấy thông tin một sản phẩm
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin sản phẩm',
        error: error.message
      });
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const products = await Product.findByCategory(categoryId);
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách sản phẩm theo danh mục',
        error: error.message
      });
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (req, res) => {
    try {
      const { name, description, price, category_id, image_url } = req.body;
      
      // Kiểm tra các trường bắt buộc
      if (!name || !price || !category_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc (tên, giá, danh mục)'
        });
      }

      const productData = {
        name,
        description: description || null, // Nếu không có mô tả thì gán null
        price: Number(price),
        category_id: Number(category_id),
        image_url: image_url || null, // Nếu không có hình thì gán null
        is_available: true
      };

      console.log('Product data to insert:', productData);
      const productId = await Product.create(productData);
      
      res.status(201).json({
        success: true,
        message: 'Tạo sản phẩm mới thành công',
        data: { productId }
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo sản phẩm mới',
        error: error.message
      });
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, categoryId, imageUrl, isAvailable } = req.body;

      const updateData = {
        name,
        description,
        price,
        category_id: categoryId,
        image_url: imageUrl,
        is_available: isAvailable
      };

      const updated = await Product.update(id, updateData);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật sản phẩm thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật sản phẩm',
        error: error.message
      });
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Product.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      res.json({
        success: true,
        message: 'Xóa sản phẩm thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa sản phẩm',
        error: error.message
      });
    }
  }
};

module.exports = productController;
