const Table = require('../models/tableModel');
const db = require('../config/database');

const tableController = {
  // Lấy danh sách tất cả bàn
  getAllTables: async (req, res) => {
    try {
      const tables = await Table.findAll();
      res.json({
        success: true,
        data: tables
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách bàn',
        error: error.message
      });
    }
  },

  // Lấy thông tin một bàn
  getTableById: async (req, res) => {
    try {
      const table = await Table.findById(req.params.id);
      
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bàn'
        });
      }

      res.json({
        success: true,
        data: table
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin bàn',
        error: error.message
      });
    }
  },

  // Tạo bàn mới
  createTable: async (req, res) => {
    try {
      const { table_number, capacity, status } = req.body;

      // Validate dữ liệu đầu vào
      if (!table_number || !capacity) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        });
      }

      // Kiểm tra số bàn đã tồn tại
      const existingTable = await Table.findByTableNumber(table_number);
      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: 'Số bàn đã tồn tại'
        });
      }

      const tableId = await Table.create({
        table_number,
        capacity,
        status: status || 'available'
      });

      res.status(201).json({
        success: true,
        message: 'Tạo bàn mới thành công',
        data: { tableId }
      });
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo bàn mới',
        error: error.message
      });
    }
  },

  // Cập nhật thông tin bàn
  updateTable: async (req, res) => {
    try {
      const { id } = req.params;
      const { tableNumber, capacity } = req.body;

      // Kiểm tra nếu đổi số bàn
      if (tableNumber) {
        const existingTable = await Table.findByTableNumber(tableNumber);
        if (existingTable && existingTable.table_id !== parseInt(id)) {
          return res.status(400).json({
            success: false,
            message: 'Số bàn đã tồn tại'
          });
        }
      }

      const updateData = {
        table_number: tableNumber,
        capacity
      };

      const updated = await Table.update(id, updateData);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bàn'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật thông tin bàn thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật thông tin bàn',
        error: error.message
      });
    }
  },

  // Cập nhật trạng thái bàn
  updateTableStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['available', 'occupied', 'reserved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái bàn không hợp lệ'
        });
      }

      const updated = await Table.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bàn'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái bàn thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái bàn',
        error: error.message
      });
    }
  },

  // Xóa bàn
  deleteTable: async (req, res) => {
    let connection;
    try {
      const { id } = req.params;
      
      connection = await db.getConnection();
      await connection.beginTransaction();

      // Kiểm tra bàn có tồn tại không
      const [tables] = await connection.query(
        'SELECT * FROM Tables WHERE table_id = ?',
        [id]
      );

      if (!tables || tables.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bàn'
        });
      }

      // Kiểm tra xem bàn có đang được sử dụng không
      if (tables[0].status === 'occupied') {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa bàn đang được sử dụng'
        });
      }

      // Kiểm tra xem bàn có liên kết với đơn hàng không
      const [orders] = await connection.query(
        'SELECT COUNT(*) as count FROM Orders WHERE table_id = ?',
        [id]
      );

      if (orders[0].count > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa bàn đã có đơn hàng'
        });
      }

      // Thực hiện xóa
      const [result] = await connection.query(
        'DELETE FROM Tables WHERE table_id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(500).json({
          success: false,
          message: 'Không thể xóa bàn'
        });
      }

      await connection.commit();
      res.json({
        success: true,
        message: 'Xóa bàn thành công'
      });

    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Delete table error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa bàn',
        error: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
};

module.exports = tableController;
