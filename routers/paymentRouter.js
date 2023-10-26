const router = require("express").Router();
const { initPayment, ipn } = require("../controllers/paymentController");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router.route("/").get(authorize, initPayment);

router.route("/ipn").post(ipn);

module.exports = router;
