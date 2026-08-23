const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
      },
    },

    // Where the click goes
    link: {
      type: String,
      default: "/",
    },

    // Banner placement
    placement: {
      type: String,
      enum: ["home-hero", "home-strip", "plp", "cart", "orders"],
      required: true,
      index: true,
    },

    // Sort order within a placement
    position: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional scheduling
    startsAt: {
      type: Date,
    },

    endsAt: {
      type: Date,
    },

    // Admin/user who created the banner
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Banner", bannerSchema);
