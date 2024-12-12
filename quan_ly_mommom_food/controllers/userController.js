const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const userController = {
  // Đăng nhập
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Kiểm tra username
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Tên đăng nhập không tồn tại'
        });
      }

      // Kiểm tra password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Mật khẩu không chính xác'
        });
      }

      // Tạo token
      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          token,
          user: {
            id: user.user_id,
            username: user.username,
            fullName: user.full_name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đăng nhập',
        error: error.message
      });
    }
  },

  // Lấy thông tin profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.user_id,
          username: user.username,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin profile',
        error: error.message
      });
    }
  },

  // Cập nhật profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, email, phone, currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Nếu có thay đổi mật khẩu
      if (currentPassword && newPassword) {
        const user = await User.findById(userId);
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: 'Mật khẩu hiện tại không chính xác'
          });
        }
      }

      const updateData = {
        full_name: fullName,
        email,
        phone,
        password: newPassword ? await bcrypt.hash(newPassword, 10) : undefined
      };

      const updated = await User.update(userId, updateData);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật thông tin thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật thông tin',
        error: error.message
      });
    }
  },

  // Admin: Lấy danh sách users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách người dùng',
        error: error.message
      });
    }
  },

  // Admin: Tạo user mới
  createUser: async (req, res) => {
    try {
      const { username, password, fullName, email, phone, role } = req.body;

      // Kiểm tra username đã tồn tại
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Tên đăng nhập đã tồn tại'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        username,
        password: hashedPassword,
        full_name: fullName,
        email,
        phone,
        role
      };

      const userId = await User.create(userData);
      res.status(201).json({
        success: true,
        message: 'Tạo người dùng thành công',
        data: { userId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo người dùng',
        error: error.message
      });
    }
  },

  // Admin: Cập nhật user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, email, phone, role, password } = req.body;

      const updateData = {
        full_name: fullName,
        email,
        phone,
        role
      };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updated = await User.update(id, updateData);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật người dùng thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật người dùng',
        error: error.message
      });
    }
  },

  // Admin: Xóa user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await User.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      res.json({
        success: true,
        message: 'Xóa người dùng thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa người dùng',
        error: error.message
      });
    }
  },

  createFirstAdmin: async (req, res) => {
    try {
      const { username, password, fullName, email, phone } = req.body;

      // Kiểm tra xem đã có admin nào chưa
      const [existingAdmins] = await db.execute(
        'SELECT * FROM Users WHERE role = ?',
        ['admin']
      );

      if (existingAdmins.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Admin account already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Tạo admin
      const [result] = await db.execute(
        `INSERT INTO Users (username, password, full_name, email, phone, role) 
         VALUES (?, ?, ?, ?, ?, 'admin')`,
        [username, hashedPassword, fullName, email, phone]
      );

      res.status(201).json({
        success: true,
        message: 'Admin account created successfully',
        data: {
          userId: result.insertId
        }
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating admin account',
        error: error.message
      });
    }
  }
};

module.exports = userController;
