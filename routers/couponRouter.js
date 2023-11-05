const router = require("express").Router();
const {
  createCoupon,
  getCoupons,
  updateCoupons,
  deleteCoupon,
  checkCoupon,
} = require("../controllers/couponController");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router
  .route("/")
  .get([authorize, admin], getCoupons)
  .post([authorize, admin], createCoupon);

router
  .route("/:id")
  .put([authorize, admin], updateCoupons)
  .delete([authorize, admin], deleteCoupon);

router.route("/:code").get(checkCoupon);
module.exports = router;
