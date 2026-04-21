const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    client_id: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["created", "failed"],
      default: "created"
    },
    fulfillment_id: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);