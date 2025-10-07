const mongoose = require('mongoose');

const specificationsSchema = new mongoose.Schema({
  color: String,
  storage: String,
  ram: String,
  screen: String,
  chip: String,
  camera: String,
  battery: String,
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
  if (this.quantity === 0) {
    this.status = 'OUT_OF_STOCK';
  } else if (this.status === 'OUT_OF_STOCK' && this.quantity > 0) {
    this.status = 'AVAILABLE';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);