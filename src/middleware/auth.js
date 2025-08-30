import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT认证中间件
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，未提供认证令牌'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被删除'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户账户已被禁用'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '认证令牌已过期'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

// 角色检查中间件
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '用户未认证'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足，需要特定角色才能访问'
      });
    }

    next();
  };
};

// 管理员权限检查
export const requireAdmin = requireRole(['admin']);

// 编辑者及以上权限检查
export const requireEditor = requireRole(['admin', 'editor']);