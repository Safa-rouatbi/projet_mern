const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    duration: {
      type: Number, // en minutes
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
