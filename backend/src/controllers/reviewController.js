// controllers/review.controller.js
const { Review } = require("../models/Review.model");
const Product = require("../models/Product.model");

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate("customerId", "fullName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { reviews } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await Review.create({
      productId,
      customerId: req.user._id,
      rating,
      comment,
    });

    const product = await Product.findById(productId);
    await product.updateRating();

    res
      .status(201)
      .json({
        success: true,
        message: "Đánh giá sản phẩm thành công",
        data: { review },
      });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Bạn đã đánh giá sản phẩm này rồi" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đánh giá" });
    }
    if (review.customerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Bạn không có quyền chỉnh sửa đánh giá này",
        });
    }

    const { rating, comment } = req.body;
    review.rating = rating;
    review.comment = comment;
    await review.save();

    const product = await Product.findById(review.productId);
    await product.updateRating();

    res.json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: { review },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đánh giá" });
    }
    if (review.customerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Bạn không có quyền xóa đánh giá này",
        });
    }

    const productId = review.productId;
    await review.deleteOne();

    const product = await Product.findById(productId);
    await product.updateRating();

    res.json({ success: true, message: "Xóa đánh giá thành công" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
