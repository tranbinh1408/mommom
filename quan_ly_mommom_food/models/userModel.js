const db = require('../config/database');

class User {
  static async findByUsername(username) {
    try {
      const [users] = await db.execute(
        'SELECT * FROM Users WHERE username = ?',
        [username]
      );
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [users] = await db.execute(
        'SELECT * FROM Users WHERE user_id = ?',
        [id]
      );
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [users] = await db.execute(
        'SELECT user_id, username, full_name, email, phone, role FROM Users'
      );
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { username, password, full_name, email, phone, role } = userData;
      const [result] = await db.execute(
        `INSERT INTO Users (username, password, full_name, email, phone, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [username, password, full_name, email, phone, role]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      const updates = [];
      const values = [];

      // Chỉ cập nhật các trường được cung cấp
      if (userData.full_name) {
        updates.push('full_name = ?');
        values.push(userData.full_name);
      }
      if (userData.email) {
        updates.push('email = ?');
        values.push(userData.email);
      }
      if (userData.phone) {
        updates.push('phone = ?');
        values.push(userData.phone);
      }
      if (userData.password) {
        updates.push('password = ?');
        values.push(userData.password);
      }
      if (userData.role) {
        updates.push('role = ?');
        values.push(userData.role);
      }

      if (updates.length === 0) return true;

      values.push(id);
      const [result] = await db.execute(
        `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`,
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
        'DELETE FROM Users WHERE user_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
