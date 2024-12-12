const jwt = require('jsonwebtoken');

const auth = {
  verifyToken: (req, res, next) => {
    try {
      // Lấy token từ header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Access token not found'
        });
      }

      // Kiểm tra format của token
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  },

  checkRole: (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Permission denied'
        });
      }

      next();
    };
  }
};

module.exports = auth;