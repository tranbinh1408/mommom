const Category = require('../models/categoryModel');

const categoryController = {
  getAllCategories: async (req, res) => {
    console.log('GET /api/categories endpoint hit');
    try {
      const categories = await Category.findAll();
      console.log('Categories fetched:', categories);
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách danh mục',
        error: error.message
      });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy danh mục'
        });
      }
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin danh mục',
        error: error.message
      });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, description, image_url } = req.body;
      const categoryId = await Category.create({ name, description, image_url });
      res.status(201).json({
        success: true,
        message: 'Tạo danh mục mới thành công',
        data: { category_id: categoryId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo danh mục mới',
        error: error.message
      });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, image_url, is_active } = req.body;
      const updated = await Category.update(id, { 
        name, 
        description, 
        image_url, 
        is_active 
      });
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy danh mục'
        });
      }
      
      res.json({
        success: true,
        message: 'Cập nhật danh mục thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật danh mục',
        error: error.message
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Category.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy danh mục'
        });
      }
      
      res.json({
        success: true,
        message: 'Xóa danh mục thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa danh mục',
        error: error.message
      });
    }
  }
};

module.exports = categoryController;