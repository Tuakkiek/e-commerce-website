// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per customer per product
reviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

// Update product rating after save
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.productId);
  if (product) {
    await product.updateRating();
  }
});

// Update product rating after delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Product = mongoose.model('Product');
    const product = await Product.findById(doc.productId);
    if (product) {
      await product.updateRating();
    }
  }
});

export default mongoose.model('Review', reviewSchema);  // Sử dụng export ESM
