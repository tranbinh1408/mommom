const db = require('../config/database');

class Table {
  static async findAll() {
    try {
      const [tables] = await db.execute('SELECT * FROM Tables');
      return tables;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [tables] = await db.execute(
        'SELECT * FROM Tables WHERE table_id = ?',
        [id]
      );
      return tables[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByTableNumber(tableNumber) {
    try {
      const [tables] = await db.execute(
        'SELECT * FROM Tables WHERE table_number = ?',
        [tableNumber]
      );
      return tables[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(tableData) {
    try {
      const { table_number, capacity, status } = tableData;
      const [result] = await db.execute(
        'INSERT INTO Tables (table_number, capacity, status) VALUES (?, ?, ?)',
        [table_number, capacity, status]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, tableData) {
    try {
      const updates = [];
      const values = [];

      if (tableData.table_number !== undefined) {
        updates.push('table_number = ?');
        values.push(tableData.table_number);
      }
      if (tableData.capacity !== undefined) {
        updates.push('capacity = ?');
        values.push(tableData.capacity);
      }

      if (updates.length === 0) return true;

      values.push(id);
      const [result] = await db.execute(
        `UPDATE Tables SET ${updates.join(', ')} WHERE table_id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.execute(
        'UPDATE Tables SET status = ? WHERE table_id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Table;
