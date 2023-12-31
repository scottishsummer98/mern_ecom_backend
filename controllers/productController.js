const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { Product, validate } = require("../models/product");

module.exports.createProduct = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).send("Something went wrong!");
    for (key in fields) {
      fields[key] = fields[key][0];
    }
    const { error } = validate(
      _.pick(fields, ["name", "description", "price", "quantity", "category"])
    );
    if (error) return res.status(400).send(error.details[0].message);
    const product = new Product(fields);
    if (files.photo) {
      fs.readFile(files.photo[0].filepath, async (err, data) => {
        if (err) return res.status(400).send("Problem in file data!");
        product.photo.data = data;
        product.photo.contentType = files.photo.type;
        try {
          const result = await product.save();
          return res.status(201).send({
            message: "Product created successfully!",
            data: _.pick(result, [
              "name",
              "description",
              "price",
              "quantity",
              "category",
            ]),
          });
        } catch (e) {
          return res.status(500).send("Internal Server error");
        }
      });
    } else {
      return res.status(400).send("No image selected");
    }
  });
};
module.exports.getProducts = async (req, res) => {
  let order = req.query.order === "asc" ? 1 : -1; //?order=desc&sortBy=name&limit=10
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const products = await Product.find()
    .select({ photo: 0 })
    .sort({ [sortBy]: order })
    .limit(limit)
    .populate("category", "name");
  return res.status(200).send(products);
};
module.exports.getProductById = async (req, res) => {
  const productId = req.params.id; //:id
  const product = await Product.findById(productId)
    .select({ photo: 0 })
    .populate("category", "name")
    .populate({
      path: "reviews",
      select: "user",
      populate: {
        path: "user",
        select: "name",
      },
    });
  if (!product) return res.status(404).send("Not Found");
  return res.status(200).send(product);
};
module.exports.getPhotoById = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId).select({
    photo: 1,
    _id: 0,
  });
  res.set("Content-Type", product.photo.contentType);
  return res.status(200).send(product.photo.data);
};
module.exports.updateProductById = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).send("Something went wrong!");
    for (key in fields) {
      fields[key] = fields[key][0];
    }
    const updatedFields = _.pick(fields, [
      "name",
      "description",
      "price",
      "quantity",
      "category",
    ]);
    _.assignIn(product, updatedFields);
    if (files.photo) {
      fs.readFile(files.photo[0].filepath, async (err, data) => {
        if (err) return res.status(400).send("Problem in file data!");
        product.photo.data = data;
        product.photo.contentType = files.photo.type;
        try {
          const result = await product.save();
          return res.status(201).send({
            message: "Product updated successfully!",
            data: _.pick(result, [
              "name",
              "description",
              "price",
              "quantity",
              "category",
            ]),
          });
        } catch (e) {
          return res.status(500).send("Internal Server error");
        }
      });
    } else {
      try {
        const result = await product.save();
        return res.status(201).send({
          message: "Product updated successfully!",
          data: _.pick(result, [
            "name",
            "description",
            "price",
            "quantity",
            "category",
          ]),
        });
      } catch (e) {
        return res.status(400).send("No image selected!");
      }
    }
  });
};
module.exports.filterProducts = async (req, res) => {
  let order = req.body.order === "desc" ? -1 : 1;
  let sortBy = req.body.sortBy ? req.body.sortBy : "price";
  let limit = req.body.limit ? parseInt(req.body.limit) : 4;
  let skip = parseInt(req.body.skip);
  let filters = req.body.filters;
  let args = {};
  for (let key in filters) {
    if (filters[key].length > 0) {
      if (key === "price") {
        args["price"] = {
          $gte: filters["price"][0],
          $lte: filters["price"][1],
        };
      }
      if (key === "category") {
        args["category"] = {
          $in: filters["category"],
        };
      }
    }
  }

  const products = await Product.find(args)
    .select({ photo: 0 })
    .populate("category", "name")
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  return res.status(200).send(products);
};
module.exports.deleteProduct = async (req, res) => {
  const _id = req.params.id;
  await Product.deleteOne({ _id: _id });
  return res.status(200).send("Product Deleted!");
};
module.exports.createReview = async (req, res) => {
  let { productId, comment, rating } = _.pick(req.body, [
    "productId",
    "comment",
    "rating",
  ]);
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).send({ message: "Product not found!" });
  }
  const newReview = {
    user: req.user._id,
    comment,
    rating,
  };
  product.reviews.push(newReview);
  await product.save();

  const totalRatings = product.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  product.avg_rating =
    product.reviews.length === 0
      ? 0
      : Math.round(totalRatings / product.reviews.length);

  await product.save();
  return res.status(201).send({
    message: "Review added successfully!",
    data: _.pick(product, ["reviews"]),
  });
};
module.exports.updateReview = async (req, res) => {
  const { productId, comment, rating } = _.pick(req.body, [
    "productId",
    "comment",
    "rating",
  ]);

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).send({ message: "Product not found!" });
  }

  const reviewIndex = product.reviews.findIndex((review) =>
    review._id.equals(req.params.id)
  );

  if (reviewIndex === -1) {
    return res.status(404).send({ message: "Review not found" });
  }

  product.reviews[reviewIndex].comment = comment;
  product.reviews[reviewIndex].rating = rating;

  await product.save();

  const totalRatings = product.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  product.avg_rating =
    product.reviews.length === 0
      ? 0
      : Math.round(totalRatings / product.reviews.length);

  await product.save();

  return res.status(200).send({
    message: "Review updated successfully!",
    data: _.pick(product, ["reviews"]),
  });
};
module.exports.deleteReview = async (req, res) => {
  let productId = req.query.productId;
  const product = await Product.findById(productId);
  const reviewIndex = product.reviews.findIndex((review) =>
    review._id.equals(req.params.id)
  );
  product.reviews.splice(reviewIndex, 1);
  await product.save();

  const totalRatings = product.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  product.avg_rating =
    product.reviews.length === 0
      ? 0
      : Math.round(totalRatings / product.reviews.length);

  await product.save();

  return res.status(200).send({
    message: "Review deleted successfully!",
    data: _.pick(product, ["_id", "reviews"]),
  });
};
