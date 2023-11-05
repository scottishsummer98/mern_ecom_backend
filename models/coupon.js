const { Schema, model } = require("mongoose");
const Joi = require("joi");

module.exports.Coupon = model(
  "Coupon",
  Schema(
    {
      code: String,
      amount: Number,
      limit: Number,
      expirationDate: Date,
    },
    { timestamps: true }
  )
);

module.exports.validate = (coupon) => {
  const schema = Joi.object({
    code: Joi.string()
      .pattern(/^[A-Z0-9]+$/)
      .min(3)
      .max(50)
      .required(),
    amount: Joi.number().required(),
    limit: Joi.number().required(),
    expirationDate: Joi.date().required(),
  });
  return schema.validate(coupon);
};
