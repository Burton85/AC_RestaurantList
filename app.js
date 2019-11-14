// Require packages from node
const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
//Setting handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//Use static files
app.use(express.static("public"));
//use method override
app.use(methodOverride("_method"));
//Use body parser
app.use(bodyParser.urlencoded({ extended: true }));
//Setting mongoose
const mongoose = require("mongoose");
const RestaurantDB = require("./models/restaurant.js");
mongoose.connect("mongodb://127.0.0.1/Restaurant", { useNewUrlParser: true });
db = mongoose.connection;

db.on("error", () => {
  console.log("db error");
});
db.once("open", () => {
  console.log("db connected");
});
//routes
app.use("/restaurants", require("./routes/restaurants.js"));
app.use("/", require("./routes/home.js"));

app.listen(port, () => {
  console.log(`express is listening on the port:${port}`);
});
