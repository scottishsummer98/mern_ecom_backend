const router = require("express").Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router
  .route("/")
  .get(getCategories)
  .post([authorize, admin], createCategory)
  .put([authorize, admin], updateCategory);

router.route("/:id").delete([authorize, admin], deleteCategory);

module.exports = router;
