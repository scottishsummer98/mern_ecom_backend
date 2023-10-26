require("express-async-errors");
const express = require("express");
const compression = require("compression");
const app = express();
const error = require("./middlewares/error");

require("./middlewares")(app);
require("./middlewares/routes")(app);

app.use(error);
app.use(compression());

module.exports = app;
