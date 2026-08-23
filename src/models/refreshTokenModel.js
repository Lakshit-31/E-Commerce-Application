const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // SHA-256 hash of the JWT
    // Never store the raw token
    tokenHash: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
    },

    ip: {
      type: String,
    },

    // TTL index: automatically deletes expired documents
    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
