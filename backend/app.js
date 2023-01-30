require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/SeqdataBase");
const homeNavigation = require("./routes/homeNavigation");
const tokenVerification = require("./middleware/tokenVerification");
const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const recipesRoutes = require("./routes/recipesRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const logger = require('morgan');

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use("/imagesRecipe", express.static("imagesRecipe"));
app.use(cors()); 
app.use(express.json());
app.use(logger('dev'));

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/", homeNavigation);
//app.use(tokenVerification);
app.use("/user", usersRoutes);
app.use("/product", productsRoutes);
app.use("/recipes", recipesRoutes);
app.use("/schedule", scheduleRoutes);

module.exports = app;