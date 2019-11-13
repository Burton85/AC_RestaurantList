// require packages from node
const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
//setting handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//use static files
app.use(express.static("public"));

//setting mongoose
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
//setting routes
app.get("/", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("err");
    return res.render(`index`, { restaurants: restaurants });
  });
});
//setting search bar
app.get("/search", (req, res) => {
  const keywords = req.query.keyword;
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("err");
    const retaurantsResualt = restaurants.filter(item => {
      return (
        item.name.toLowerCase().includes(keywords.toLowerCase()) ||
        item.name_en.toLowerCase().includes(keywords.toLowerCase())
      );
    });
    return res.render(`index`, {
      restaurants: retaurantsResualt,
      keywords: keywords
    });
  });
});
//edit page
app.get("/restaurants/:id/edit", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("error");
    const restaurantsResults = restaurants.filter(
      item => item.id.toString() === req.params.id
    );
    res.render("show", { restaurant: restaurantsResults[0] });
  });
});
//go to show page
app.get("/restaurants/:id", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("error");
    const restaurantsResults = restaurants.filter(
      item => item.id.toString() === req.params.id
    );
    res.render("show", { restaurant: restaurantsResults[0] });
  });
});

app.listen(port, () => {
  console.log(`express is listening on the port:${port}`);
});
