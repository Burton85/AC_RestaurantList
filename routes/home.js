const express = require("express");
const router = express.Router();
const RestaurantDB = require("../models/restaurant");

//setting routes
router.get("/", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("err");
    return res.render(`index`, { restaurants: restaurants });
  });
});
//Create new restaurant
router.get("/new", (req, res) => {
  res.render("new");
});
router.post("/new", (req, res) => {
  const newRestaurantInfo = req.body;
  if (
    newRestaurantInfo.name &&
    newRestaurantInfo.name_en &&
    newRestaurantInfo.category &&
    newRestaurantInfo.location &&
    newRestaurantInfo.phone &&
    newRestaurantInfo.description &&
    newRestaurantInfo.image &&
    newRestaurantInfo.rating &&
    newRestaurantInfo.location
  ) {
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
      return res.redirect(`/restaurants/${newRestaurant._id}`);
    });
  } else {
    res.render("new", {
      message: "Please make sure the whole form has been filled up."
    });
  }
});
//Setting search bar
router.post("/search", (req, res) => {
  const keywords = req.body.keywords;
  const sorts = req.body.sorts;
  let sort_name = "name";
  let sort_sort = "asc";
  if (sorts == "asc" || sorts == "desc") sort_sort = sorts;
  else if (sorts == "rating") sort_name = "rating";
  else if (sorts == "area") sort_name = "location";
  console.log("sort_name", sort_name);
  console.log("sort_sort", sort_sort);
  RestaurantDB.find({})
    .sort({ sort_name: sort_sort })
    .exec((err, restaurants) => {
      if (err) return console.log("Sort error");
      const restaurantsResult = restaurants.filter(item => {
        return (
          item.name.toLowerCase().includes(keywords.toLowerCase()) ||
          item.name_en.toLowerCase().includes(keywords.toLowerCase()) ||
          item.category.toLowerCase().includes(keywords.toLowerCase()) ||
          item.location.toLowerCase().includes(keywords.toLowerCase())
        );
      });
      return res.render("index", {
        restaurants: restaurantsResult,
        keywords: keywords,
        sorts: sorts
      });
    });
});
module.exports = router;
