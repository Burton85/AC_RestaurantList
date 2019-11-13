//import modules
const mongoose = require("mongoose");
const RestaurantDB = require("../restaurant.js");
const restaurantJson = require("../restaurant.json");
const results = restaurantJson.results;
//connect with Database
mongoose.connect("mongodb://127.0.0.1/Restaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on("error", () => {
  console.log("db error");
});

db.once("open", () => {
  console.log("db connected");
  // for (let i = 0; i < 10; i++) {
  //   RestaurantDB.create({ name: "name:-" + i });
  // }
  for (let i = 0; i < results.length; i++) {
    RestaurantDB.create({
      name: results[i].name,
      name_en: results[i].name_en,
      category: results[i].category,
      image: results[i].image,
      location: results[i].location,
      phone: results[i].phone,
      google_map: results[i].google_map,
      rating: results[i].rating,
      description: results[i].description
    });
  }
});
console.log("done");
