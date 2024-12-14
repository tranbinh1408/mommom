const db = require('../config/database');

const Category = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM Categories WHERE is_active = true');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM Categories WHERE category_id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { name, description, image_url } = data;
    const [result] = await db.query(
      'INSERT INTO Categories (name, description, image_url, is_active) VALUES (?, ?, ?, true)',
      [name, description, image_url]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { name, description, image_url, is_active } = data;
    const [result] = await db.query(
      'UPDATE Categories SET name = ?, description = ?, image_url = ?, is_active = ? WHERE category_id = ?',
      [name, description, image_url, is_active, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    // Soft delete - chỉ cập nhật trạng thái is_active
    const [result] = await db.query(
      'UPDATE Categories SET is_active = false WHERE category_id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Category;