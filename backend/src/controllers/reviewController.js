// controllers/reviewController.js
import pkg from '../models/Review.js';
const { Review } = pkg; // Sử dụng destructuring để lấy 'Review' từ module

// Lấy tất cả đánh giá của một sản phẩm
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate("customerId", "fullName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { reviews } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Tạo đánh giá mới cho sản phẩm
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Tạo đánh giá mới
    const review = await Review.create({
      productId,
      customerId: req.user._id,
      rating,
      comment,
    });

    // Cập nhật rating cho sản phẩm
    const product = await Product.findById(productId);
    await product.updateRating();

    res.status(201).json({
      success: true,
      message: "Đánh giá sản phẩm thành công",
      data: { review },
    });
  } catch (error) {
    // Kiểm tra lỗi nếu người dùng đã đánh giá sản phẩm này rồi
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cập nhật đánh giá của người dùng
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá" });
    }

    // Kiểm tra nếu người dùng không phải là chủ sở hữu đánh giá
    if (review.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa đánh giá này",
      });
    }

    // Cập nhật thông tin đánh giá
    const { rating, comment } = req.body;
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Cập nhật lại rating cho sản phẩm
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

// Xóa đánh giá
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá" });
    }

    // Kiểm tra nếu người dùng không phải là chủ sở hữu đánh giá
    if (review.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa đánh giá này",
      });
    }

    const productId = review.productId;
    await review.deleteOne();

    // Cập nhật lại rating cho sản phẩm
    const product = await Product.findById(productId);
    await product.updateRating();

    res.json({ success: true, message: "Xóa đánh giá thành công" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
