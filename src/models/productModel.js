const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      maxlength: 4000,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    mrp: {
      type: Number,
      required: true,
      min: 1,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    video: {
      url: String,
      publicId: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    stockQty: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    tags: [
      {
        type: String,
        enum: ["trending", "top-selling", "new"],
      },
    ],

    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual: discount percentage
productSchema.virtual("discountPercent").get(function () {
  if (!this.mrp || this.mrp <= 0) {
    return 0;
  }

  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

// Virtual: stock status
productSchema.virtual("inStock").get(function () {
  return this.stockQty > 0;
});

// Generate slug before validation
productSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Random 6-character string
    const randomString = Math.random().toString(36).substring(2, 8);

    this.slug = `${baseSlug}-${randomString}`;
  }

  // Price cannot exceed MRP
  if (this.price > this.mrp) {
    return next(new Error("Price cannot exceed MRP"));
  }

  next();
});

// Include virtuals in JSON response
productSchema.set("toJSON", {
  virtuals: true,
});

productSchema.set("toObject", {
  virtuals: true,
});

module.exports = mongoose.model("Product", productSchema);
