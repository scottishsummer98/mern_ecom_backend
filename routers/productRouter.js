const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getProductById,
  getPhotoById,
  updateProductById,
  filterProducts,
  deleteProduct,
} = require("../controllers/productController");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router.route("/").get(getProducts).post([authorize, admin], createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put([authorize, admin], updateProductById);

router.route("/:id").delete([authorize, admin], deleteProduct);

router.route("/photo/:id").get(getPhotoById);

router.route("/filter").post(filterProducts);
module.exports = router;
