import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import config from '../config/config.js';

export const register = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, province, password } = req.body;

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
    }

    const user = new User({
      fullName,
      phoneNumber,
      email,
      province,
      password,
      role: 'CUSTOMER'
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
    }

    if (user.status === 'LOCKED') {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};