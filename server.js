require("dotenv/config");
const app = require("./app");
const mongoose = require("mongoose");

global.__basedir = __dirname;

// const DB = process.env.MONGODB_SERVER.replace(
//   "<PASSWORD>",
//   process.env.DB_PASSWORD
// );

mongoose
  .connect(process.env.MONGODB_URL_LOCAL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB Connection Failed!"));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
