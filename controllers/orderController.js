const _ = require("lodash");
const { Order } = require("../models/order");

module.exports.getOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    status: "Complete",
  })
    .populate({
      path: "cartItems",
      select: "product",
      populate: {
        path: "product",
        select: "name",
      },
    })
    .populate("coupon");
  return res.status(200).send(orders);
};
