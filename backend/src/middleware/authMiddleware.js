// middleware/authMiddleware.js

// Protect routes - chỉ kiểm tra session
export const protect = (req, res, next) => {
  // Kiểm tra xem user đã đăng nhập chưa
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để truy cập'
    });
  }

  req.user = req.session.user; // Lấy thông tin user từ session
  next();
};

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này'
      });
    }
    next();
  };
};

// Helper function để tạo session cho user
export const createSession = (req, user) => {
  req.session.user = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  };
};

// Helper function để xóa session
export const destroySession = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};