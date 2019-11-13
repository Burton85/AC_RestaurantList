// Require packages from node
const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
//Setting handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//Use static files
app.use(express.static("public"));

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
//setting routes
app.get("/", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("err");
    return res.render(`index`, { restaurants: restaurants });
  });
});
//Create new restaurant
app.get("/new", (req, res) => {
  res.render('new');
});
app.post("/new", (req, res) => {
  const newRestaurantInfo = req.body;
  const newRestaurant = RestaurantDB({
    name: newRestaurantInfo.name,
    name_en: newRestaurantInfo.name_en,
    category: newRestaurantInfo.category,
    location: newRestaurantInfo.location,
    phone: newRestaurantInfo.phone,
    description: newRestaurantInfo.description,
    image: newRestaurantInfo.image,
    rating: newRestaurantInfo.rating,
    google_map:
      "https://www.google.com/maps/place/" + newRestaurantInfo.location
  });
  newRestaurant.save(err => {
    if (err) return console.log(err);
    return res.redirect("/");
  });
});
//Setting search bar
app.get("/search", (req, res) => {
  const keywords = req.query.keyword;
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("find err");
    const retaurantsResualt = restaurants.filter(item => {
      return (
        item.name.toLowerCase().includes(keywords.toLowerCase()) ||
        item.name_en.toLowerCase().includes(keywords.toLowerCase()) ||
        item.category.toLowerCase().includes(keywords.toLowerCase()) ||
        item.location.toLowerCase().includes(keywords.toLowerCase())
      );
    });
    return res.render(`index`, {
      restaurants: retaurantsResualt,
      keywords: keywords
    });
  });
});
//Go to show page
app.get("/restaurants/:id", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("show error");
    const restaurantsResults = restaurants.filter(
      item => item._id.toString() === req.params.id
    );
    res.render("show", { restaurant: restaurantsResults[0] });
  });
});
//edit page
app.get("/restaurants/:id/edit", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("error");
    const restaurantsResults = restaurants.filter(
      item => item._id.toString() === req.params.id
    );
    res.render("edit", { restaurant: restaurantsResults[0] });
  });
});
app.post("/restaurants/:id/edit", (req, res) => {
  const editRestaurant = req.body;
  const restaurantId = req.params.id;
  RestaurantDB.find((err, restaurants) => {
    const restaurantCol = restaurants.filter(item => item._id == restaurantId);
    const restaurantData = restaurantCol[0];
    if (err) return console.log("read error");
    else if (!restaurantData) return console.log("cant find data");
    else {
      if (editRestaurant.name != "") restaurantData.name = editRestaurant.name;
      if (editRestaurant.category != "")
        restaurantData.category = editRestaurant.category;
      if (editRestaurant.location != "")
        restaurantData.location = editRestaurant.location;
      if (editRestaurant.phone != "")
        restaurantData.phone = editRestaurant.phone;
      if (editRestaurant.description != "")
        restaurantData.description = editRestaurant.description;
      if (editRestaurant.image != "")
        restaurantData.image = editRestaurant.image;

      restaurantData.save(err => {
        if (err) return console.log("save error");
        return res.redirect(`/restaurants/${restaurantId}`);
      });
    }
  });
});
//Delete restaurants
app.post("/restaurants/:id/delete", (req, res) => {
  const restaurantId = req.params.id;
  RestaurantDB.findById(restaurantId, (err, restaurant) => {
    restaurant.remove(err => {
      if (err) return console.log("remove error");
      return res.redirect("/");
    });
  });
});

app.listen(port, () => {
  console.log(`express is listening on the port:${port}`);
});
