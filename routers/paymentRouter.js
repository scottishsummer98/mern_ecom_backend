const router = require("express").Router();
const {
  initPayment,
  ipn,
  paymentSuccess,
  paymentFail,
  paymentCancel,
} = require("../controllers/paymentController");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router.route("/:cc").get(authorize, initPayment);
router.route("/ipn").post(ipn);
router.route("/success").post(paymentSuccess);
router.route("/fail").post(paymentFail);
router.route("/cancel").post(paymentCancel);
module.exports = router;
