const authRouter = require("../routers/authRouter");
const categoryRouter = require("../routers/categoryRouter");
const productRouter = require("../routers/productRouter");
const couponRouter = require("../routers/couponRouter");
const cartRouter = require("../routers/cartRouter");
const orderRouter = require("../routers/orderRouter");
const profileRouter = require("../routers/profileRouter");
const paymentRouter = require("../routers/paymentRouter");

module.exports = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/product", productRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/payment", paymentRouter);
};
