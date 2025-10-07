import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  specifications: {
    type: Object,
    default: {},
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
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
}, { _id: false });

// Method to calculate subtotal for order item
orderItemSchema.methods.calculateSubtotal = function () {
  const priceAfterDiscount = this.price * (1 - this.discount / 100);
  return priceAfterDiscount * this.quantity;
};

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    required: true,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  commune: {
    type: String,
    required: true,
    trim: true,
  },
  detailAddress: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"],
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    trim: true,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function(items) {
          return items && items.length > 0;
        },
        message: "Order must have at least one item",
      },
    },
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "BANK_TRANSFER"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID"],
      default: "UNPAID",
    },
    notes: {
      type: String,
      trim: true,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    
    // Find the last order number for today
    const lastOrder = await mongoose.model("Order").findOne({
      orderNumber: new RegExp(`^ORD${year}${month}${day}`),
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, "0")}`;
  }
  
  next();
});

// Add initial status to history when creating order
orderSchema.pre("save", function (next) {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      updatedBy: this.customerId,
      updatedAt: new Date(),
      note: "Order created",
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function (status, userId, note) {
  this.status = status;
  
  this.addStatusHistory(status, userId, note);
  
  // Update payment status if delivered
  if (status === "DELIVERED" && this.paymentMethod === "COD") {
    this.paymentStatus = "PAID";
  }
  
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancel = async function (userId, note) {
  if (this.status === "DELIVERED") {
    throw new Error("Cannot cancel delivered order");
  }
  
  if (this.status === "CANCELLED") {
    throw new Error("Order is already cancelled");
  }
  
  this.status = "CANCELLED";
  this.addStatusHistory("CANCELLED", userId, note || "Order cancelled");
  
  return this.save();
};

// Method to calculate total
orderSchema.methods.calculateTotal = function () {
  return this.items.reduce((total, item) => {
    const priceAfterDiscount = item.price * (1 - item.discount / 100);
    return total + (priceAfterDiscount * item.quantity);
  }, 0);
};

// Method to add status history
orderSchema.methods.addStatusHistory = function (status, userId, note) {
  this.statusHistory.push({
    status,
    updatedBy: userId,
    updatedAt: new Date(),
    note: note || "",
  });
};

// Method to track order
orderSchema.methods.trackOrder = function () {
  return this.statusHistory.sort((a, b) => a.updatedAt - b.updatedAt);
};

// Index for search optimization
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;