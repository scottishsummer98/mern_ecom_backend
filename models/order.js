const { Schema, model } = require("mongoose");
const { CartItemSchema } = require("./cartItem");

module.exports.Order = model(
  "Order",
  Schema(
    {
      cartItems: [CartItemSchema],
      transaction_id: {
        type: String,
        unique: true,
      },
      address: {
        phone: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        postcode: Number,
        country: String,
      },
      status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Complete"],
      },
      coupon_applied: {
        type: String,
        enum: ["N", "Y"],
      },
      coupon: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      sessionKey: String,
    },
    { timestamps: true }
  )
);
