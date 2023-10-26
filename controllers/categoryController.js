const _ = require("lodash");
const { Category, validate } = require("../models/category");

module.exports.createCategory = async (req, res) => {
  const { error } = validate(_.pick(req.body, ["name"]));
  if (error) return res.status(400).send(error.details[0].message);
  const category = new Category(_.pick(req.body, ["name"]));
  const result = await category.save();
  return res.status(201).send({
    message: "Category created successfully!",
    data: {
      name: result.name,
    },
  });
};

module.exports.getCategories = async (req, res) => {
  const categories = await Category.find()
    .select({
      _id: 1,
      name: 1,
    })
    .sort({ createdAt: -1 });
  return res.status(200).send(categories);
};

module.exports.updateCategory = async (req, res) => {
  const { _id, name } = _.pick(req.body, ["_id", "name"]);
  await Category.updateOne(
    {
      _id: _id,
    },
    { name: name }
  );
  return res.status(200).send("Category updated!");
};

module.exports.deleteCategory = async (req, res) => {
  const _id = req.params.id;
  await Category.deleteOne({ _id: _id });
  return res.status(200).send("Category Deleted!");
};
