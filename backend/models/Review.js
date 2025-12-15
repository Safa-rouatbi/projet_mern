const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    comment: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

/**
 * 🔒 Contrainte métier :
 * 1 client → 1 seul avis par provider
 */
reviewSchema.index({ client: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
