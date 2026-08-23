const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Human-readable order number
    // Example: ORD-20260817-8FQ2K
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // Customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Order items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        // Multi-vendor order
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          index: true,
        },

        // Snapshot of product information
        title: {
          type: String,
          required: true,
        },

        image: {
          type: String,
        },

        // Snapshot of price at purchase
        price: {
          type: Number,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
          min: 1,
        },

        status: {
          type: String,
          enum: [
            "placed",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
          ],
          default: "placed",
        },

        // Starts the 2-day return clock
        deliveredAt: {
          type: Date,
        },

        returnRequested: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Snapshot of shipping address
    shippingAddress: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },

    // Calculated server-side only
    amount: {
      itemsTotal: {
        type: Number,
        required: true,
      },

      shipping: {
        type: Number,
        required: true,
      },

      total: {
        type: Number,
        required: true,
      },
    },

    // Payment information
    payment: {
      method: {
        type: String,
        enum: ["cod", "razorpay"],
        required: true,
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },

      razorpayOrderId: String,

      razorpayPaymentId: String,

      razorpaySignature: String,

      paidAt: Date,
    },

    // Overall order status
    orderStatus: {
      type: String,
      enum: ["pending_payment", "confirmed", "completed", "cancelled"],
      default: "confirmed",
      index: true,
    },

    placedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
