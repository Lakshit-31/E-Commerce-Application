const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema(
  {
    // Original order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // _id of the embedded order item
    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Customer requesting the return
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Seller who owns the product
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Product being returned
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Reason for return
    reason: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },

    // Exactly ONE photo
    photo: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
      },
    },

    // Return status
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "picked", "refunded"],
      default: "requested",
      index: true,
    },

    // Seller's response/note
    sellerNote: {
      type: String,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// One return request per order item
returnRequestSchema.index({ order: 1, orderItemId: 1 }, { unique: true });

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);
