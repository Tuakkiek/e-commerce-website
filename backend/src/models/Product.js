// models/Product.js
import mongoose from 'mongoose';

const specificationsSchema = new mongoose.Schema({
  screenSize: String,           // Kích thước màn hình (e.g., "6.1 inch")
  cpu: String,                  // CPU/Chip (e.g., "Apple A18 Bionic")
  operatingSystem: String,      // Hệ điều hành (e.g., "iOS")
  storage: String,              // Bộ nhớ trong (e.g., "128GB")
  ram: String,                  // RAM (e.g., "8GB")
  mainCamera: String,           // Camera chính (e.g., "48MP - 12MP")
  frontCamera: String,          // Camera trước (e.g., "12MP")
  colors: [String],             // Màu sắc (e.g., ["Black", "White", "Pink", "Blue", "Green"])
  resolution: String,           // Độ phân giải màn hình (e.g., "2556×1179 pixel")
  manufacturer: String,         // Hãng sản xuất (e.g., "Apple")
  condition: String,            // Tình trạng SP (e.g., "New", "Like New", "Used")
  battery: String,              // Pin (e.g., "3200mAh")
  weight: String,               // Trọng lượng (e.g., "170g")
  dimensions: String,           // Kích thước (e.g., "146.7 x 71.5 x 7.8 mm")
}, { _id: false });

// Variant schema: price per storage and color
const variantSchema = new mongoose.Schema({
  storage: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discount: { type: Number, min: 0, max: 100 },
  stock: { type: Number, default: 0, min: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    specifications: specificationsSchema,
    // Per-variant pricing (storage + color)
    variants: [variantSchema],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "OUT_OF_STOCK", "DISCONTINUED"],
      default: "AVAILABLE",
    },
    installmentOption: {
      type: String,
      enum: ["ZERO_PERCENT_ZERO_DOWN", "ZERO_PERCENT", "NONE"],
      default: "NONE",
    },
    images: [String],
    description: {
      type: String,
      trim: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate final price
productSchema.methods.calculatePrice = function () {
  return this.originalPrice - (this.originalPrice * this.discount / 100);
};

// Update product rating
productSchema.methods.updateRating = async function () {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ productId: this._id });
  
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / reviews.length;
    this.totalReviews = reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  
  await this.save();
};

// Auto-update status based on quantity
productSchema.pre('save', function (next) {
  // Auto status from quantity
  if (this.quantity === 0) {
    this.status = 'OUT_OF_STOCK';
  } else if (this.status === 'OUT_OF_STOCK' && this.quantity > 0) {
    this.status = 'AVAILABLE';
  }

  // Derive main price from variants if available (use lowest variant price)
  if (Array.isArray(this.variants) && this.variants.length > 0) {
    const prices = this.variants
      .map(v => typeof v.price === 'number' ? v.price : NaN)
      .filter(p => Number.isFinite(p));
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      this.price = minPrice;
      // If originalPrice missing or lower than price, set to price to keep valid
      if (typeof this.originalPrice !== 'number' || this.originalPrice < this.price) {
        this.originalPrice = this.price;
      }
      // Recalculate discount if necessary
      if (this.originalPrice > 0) {
        const discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
        this.discount = Math.max(0, Math.min(100, discount));
      }
    }
  }

  next();
});

export default mongoose.model("Product", productSchema);
