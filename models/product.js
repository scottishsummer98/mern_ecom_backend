const { Schema, model } = require("mongoose");
const Joi = require("joi");

const ReviewSchema = Schema(
  {
    comment: String,
    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ProductSchema = Schema(
  {
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    avg_rating: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

module.exports.validate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(2000).required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    category: Joi.string().required(),
  });
  return schema.validate(product);
};

module.exports.Product = model("Product", ProductSchema);

// module.exports.Product = model(
//   "Product",
//   Schema(
//     {
//       name: String,
//       description: String,
//       price: Number,
//       quantity: Number,
//       sold: {
//         type: Number,
//         default: 0,
//       },
//       category: {
//         type: Schema.Types.ObjectId,
//         ref: "Category",
//         required: true,
//       },
//       photo: {
//         data: Buffer,
//         contentType: String,
//       },
//     },
//     { timestamps: true }
//   )
// );
