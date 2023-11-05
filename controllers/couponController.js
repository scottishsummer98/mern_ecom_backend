const _ = require("lodash");
const { Coupon, validate } = require("../models/coupon");

module.exports.createCoupon = async (req, res) => {
  const { error } = validate(
    _.pick(req.body, ["code", "amount", "limit", "expirationDate"])
  );
  if (error) return res.status(400).send(error.details[0].message);
  const coupon = new Coupon(
    _.pick(req.body, ["code", "amount", "limit", "expirationDate"])
  );
  const result = await coupon.save();
  return res.status(201).send({
    message: "Coupon created successfully!",
    data: {
      code: result.code,
      amount: result.amount,
      limit: result.limit,
      expirationDate: result.expirationDate,
    },
  });
};

module.exports.getCoupons = async (req, res) => {
  const coupons = await Coupon.find()
    .select({
      _id: 1,
      code: 1,
      amount: 1,
      limit: 1,
      expirationDate: 1,
    })
    .sort({ createdAt: -1 });
  return res.status(200).send(coupons);
};

module.exports.updateCoupons = async (req, res) => {
  const _id = req.params.id;
  const { code, amount, limit, expirationDate } = _.pick(req.body, [
    "code",
    "amount",
    "limit",
    "expirationDate",
  ]);
  await Coupon.updateOne(
    {
      _id: _id,
    },
    { code: code, amount: amount, limit: limit, expirationDate: expirationDate }
  );
  return res.status(200).send("Coupon updated!");
};

module.exports.deleteCoupon = async (req, res) => {
  const _id = req.params.id;
  await Coupon.deleteOne({ _id: _id });
  return res.status(200).send("Coupon Deleted!");
};
module.exports.checkCoupon = async (req, res) => {
  const code = req.params.code;
  const coupon = await Coupon.findOne({ code: code });
  if (!coupon) {
    return res.status(404).send("Invalid coupon!");
  }
  if (coupon.limit == 0 || coupon.expirationDate < Date.now()) {
    return res.status(404).send("Coupon expired");
  }
  return res.status(200).send({
    message: "Coupon Applied Successfully!",
    data: coupon,
  });
};
