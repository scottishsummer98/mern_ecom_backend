const passport = require("passport");
const { User } = require("./models/user");
const _ = require("lodash");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      "https://mern-ecom-backend-5xg2.onrender.com/api/auth/google/callback",
    proxy: true,
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
const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL:
      "https://mern-ecom-backend-5xg2.onrender.com/api/auth/facebook/callback",
  },
  async (accessToken, refreshToken, profile, cb) => {
    let user = await User.findOne({
      facebookId: profile.id,
      email: profile.email,
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
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.email,
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
passport.use(googleStrategy);
passport.use(facebookStrategy);

module.exports = passport;