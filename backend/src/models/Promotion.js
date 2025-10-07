import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    applicableProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "EXPIRED"],
      default: "ACTIVE",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if promotion is active
promotionSchema.methods.isActive = function () {
  const now = new Date();
  
  if (this.status === "INACTIVE" || this.status === "EXPIRED") {
    return false;
  }
  
  if (now < this.startDate || now > this.endDate) {
    return false;
  }
  
  return true;
};

// Method to activate promotion
promotionSchema.methods.activate = async function () {
  const now = new Date();
  
  if (now > this.endDate) {
    throw new Error("Cannot activate expired promotion");
  }
  
  this.status = "ACTIVE";
  return this.save();
};

// Method to deactivate promotion
promotionSchema.methods.deactivate = async function () {
  this.status = "INACTIVE";
  return this.save();
};

// Method to apply discount to product price
promotionSchema.methods.applyToProduct = function (productPrice) {
  if (!this.isActive()) {
    return productPrice;
  }
  
  if (this.discountType === "PERCENTAGE") {
    return productPrice * (1 - this.discountValue / 100);
  } else {
    // FIXED discount
    return Math.max(0, productPrice - this.discountValue);
  }
};

// Automatically update status based on dates
promotionSchema.pre("save", function (next) {
  const now = new Date();
  
  if (now > this.endDate && this.status !== "EXPIRED") {
    this.status = "EXPIRED";
  }
  
  next();
});

// Index for search optimization
promotionSchema.index({ status: 1, startDate: 1, endDate: 1 });
promotionSchema.index({ applicableProducts: 1 });

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;