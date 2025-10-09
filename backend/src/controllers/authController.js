// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createSession, destroySession } from '../middleware/authMiddleware.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }
    
    // So sánh mật khẩu - CHỈ CẦN BƯỚC NÀY
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }
    
    // Tạo session
    createSession(req, user);
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
};

export const logout = async (req, res) => {
  try {
    await destroySession(req);
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi đăng xuất' 
    });
  }
};

// API lấy thông tin user hiện tại
export const getCurrentUser = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};