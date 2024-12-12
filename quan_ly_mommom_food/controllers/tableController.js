const Table = require('../models/tableModel');

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
      const { tableNumber, capacity } = req.body;

      // Kiểm tra số bàn đã tồn tại
      const existingTable = await Table.findByTableNumber(tableNumber);
      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: 'Số bàn đã tồn tại'
        });
      }

      const tableData = {
        table_number: tableNumber,
        capacity,
        status: 'available'
      };

      const tableId = await Table.create(tableData);
      res.status(201).json({
        success: true,
        message: 'Tạo bàn mới thành công',
        data: { tableId }
      });
    } catch (error) {
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
  }
};

module.exports = tableController;
