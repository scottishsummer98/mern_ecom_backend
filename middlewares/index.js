const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

module.exports = (app) => {
  // app.use(
  //   cors({
  //     origin: "https://mernecom.netlify.app",
  //     credentials: true,
  //   })
  // );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
};
