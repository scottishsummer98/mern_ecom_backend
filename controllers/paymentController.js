const { CartItem } = require("../models/cartItem");
const { Profile } = require("../models/profile");

const PaymentSession = require("ssl-commerz-node").PaymentSession;

module.exports.initPayment = async (req, res) => {
  const userId = req.user._id;
  const cartItems = await CartItem.find({ user: userId });
  const profile = await Profile.findOne({ user: userId });
  const { address1, address2, city, state, postcode, country, phone } = profile;
  const totalAmount = cartItems
    .map((item) => item.count * item.price)
    .reduce((a, b) => a + b, 0);
  const totalItem = cartItems
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);
  const transactionId =
    "_" + Math.random().toString(36).substring(2, 9) + new Date().getTime();
  const payment = new PaymentSession(
    true,
    process.env.SSLCOMMERZ_STORE_ID,
    process.env.SSLCOMMERZ_STORE_PASSWORD
  );

  // Set the urls
  payment.setUrls({
    success: "yoursite.com/success", // If payment Succeed
    fail: "yoursite.com/fail", // If payment failed
    cancel: "yoursite.com/cancel", // If user cancel payment
    ipn: "https://mern-ecom-backend-5xg2.onrender.com/api/payment/ipn", // SSLCommerz will send http post request in this link
  });

  // Set order details
  payment.setOrderInfo({
    total_amount: totalAmount, // Number field
    currency: "BDT", // Must be three character string
    tran_id: transactionId, // Unique Transaction id
    emi_option: 0, // 1 or 0
  });

  // Set customer info
  payment.setCusInfo({
    name: req.user.name,
    email: req.user.email,
    add1: address1,
    add2: address2,
    city: city,
    state: state,
    postcode: postcode,
    country: country,
    phone: phone,
    fax: phone,
  });

  // Set shipping info
  payment.setShippingInfo({
    method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
    num_item: totalItem,
    name: req.user.name,
    add1: address1,
    add2: address2,
    city: city,
    state: state,
    postcode: postcode,
    country: country,
  });

  // Set Product Profile
  payment.setProductInfo({
    product_name: "Mern ecom products",
    product_category: "General",
    product_profile: "general",
  });

  payment.paymentInit().then((response) => {
    return res.status(200).send(response);
  });
};

module.exports.ipn = async (req, res) => {
  console.log(req.body);
};
