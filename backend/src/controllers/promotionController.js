// controllers/promotion.controller.js
const { Promotion } = require('../models/Review.model');

exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .populate('applicableProducts', 'name price')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { promotions } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getActivePromotions = async (req, res) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      status: 'ACTIVE',
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate('applicableProducts', 'name price images');

    res.json({ success: true, data: { promotions } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Tạo khuyến mãi thành công', data: { promotion } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
    }

    res.json({ success: true, message: 'Cập nhật khuyến mãi thành công', data: { promotion } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
    }

    res.json({ success: true, message: 'Xóa khuyến mãi thành công' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};