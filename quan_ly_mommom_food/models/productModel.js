const db = require('../config/database');

class Product {
  static async findAll() {
    try {
      const [products] = await db.execute(`
        SELECT p.*, c.name as category_name 
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.category_id
      `);
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [products] = await db.execute(
        `SELECT p.*, c.name as category_name 
         FROM Products p
         LEFT JOIN Categories c ON p.category_id = c.category_id
         WHERE p.product_id = ?`,
        [id]
      );
      return products[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByCategory(categoryId) {
    try {
      const [products] = await db.execute(
        `SELECT * FROM Products WHERE category_id = ? AND is_available = 1`,
        [categoryId]
      );
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async create(productData) {
    try {
      const { name, description, price, category_id, image_url, is_available } = productData;
      const [result] = await db.execute(
        `INSERT INTO Products (name, description, price, category_id, image_url, is_available) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, price, category_id, image_url, is_available]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, productData) {
    try {
      const updates = [];
      const values = [];

      // Chỉ cập nhật các trường được cung cấp
      if (productData.name !== undefined) {
        updates.push('name = ?');
        values.push(productData.name);
      }
      if (productData.description !== undefined) {
        updates.push('description = ?');
        values.push(productData.description);
      }
      if (productData.price !== undefined) {
        updates.push('price = ?');
        values.push(productData.price);
      }
      if (productData.category_id !== undefined) {
        updates.push('category_id = ?');
        values.push(productData.category_id);
      }
      if (productData.image_url !== undefined) {
        updates.push('image_url = ?');
        values.push(productData.image_url);
      }
      if (productData.is_available !== undefined) {
        updates.push('is_available = ?');
        values.push(productData.is_available);
      }

      if (updates.length === 0) return true;

      values.push(id);
      const [result] = await db.execute(
        `UPDATE Products SET ${updates.join(', ')} WHERE product_id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM Products WHERE product_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
