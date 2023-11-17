const router = require("express").Router();
const passport = require("passport");
const { User } = require("../models/user");
const _ = require("lodash");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      "https://mern-ecom-backend-5xg2.onrender.com/auth/google/redirect",
  },
  async (accessToken, refreshToken, profile, cb) => {
    let user = await User.findOne({
      googleId: profile.id,
      email: profile._json.email,
    });
    if (user) {
      const token = user.generateJWT();
      const response = {
        message: "Login Successful!",
        token: token,
      };
      cb(null, response);
    } else {
      user = new User({
        googleId: profile.id,
        name: profile._json.name,
        email: profile._json.email,
      });
      await user.save();
      const token = user.generateJWT();
      const response = {
        message: "Registration Successful!",
        token: token,
      };
      cb(null, response);
    }
  }
);
passport.use(strategy);

router
  .route("/")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router
  .route("/redirect")
  .get(passport.authenticate("google", { session: false }), (req, res) => {
    res.status(201).send(req.user);
  });

module.exports = router;
