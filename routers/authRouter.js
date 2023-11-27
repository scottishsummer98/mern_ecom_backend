const router = require("express").Router();
const passport = require("../passport");
const {
  userRegistration,
  userLogin,
} = require("../controllers/authController");

// General
router.route("/registration").post(userRegistration);
router.route("/login").post(userLogin);

//Google
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router
  .route("/google/callback")
  .get(passport.authenticate("google", { session: false }), (req, res) => {
    res.redirect(
      `${process.env.REACT_APP_FRONT_END_API_URL}auth?token=${req.user.token}&message=${req.user.message}`
    );
  });

//Facebook
router.route("/facebook").get(
  passport.authenticate("facebook", {
    scope: ["profile"],
  })
);
router
  .route("/facebook/callback")
  .get(passport.authenticate("facebook"), (req, res) => {
    res.redirect(
      `${process.env.REACT_APP_FRONT_END_API_URL}auth?token=${req.user.token}&message=${req.user.message}`
    );
  });
module.exports = router;
