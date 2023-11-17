const router = require("express").Router();
const {
  userRegistration,
  userLogin,
} = require("../controllers/authController");

router.route("/registration").post(userRegistration);
router.route("/login").post(userLogin);

module.exports = router;
