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
router.get("/search", (req, res) => {
  const keywords = req.query.keywords;
  let sorts = req.query.sorts;

  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("find err");
    if (keywords) {
      restaurants = restaurants.filter(item => {
        return (
          item.name.toLowerCase().includes(keywords.toLowerCase()) ||
          item.name_en.toLowerCase().includes(keywords.toLowerCase()) ||
          item.category.toLowerCase().includes(keywords.toLowerCase()) ||
          item.location.toLowerCase().includes(keywords.toLowerCase())
        );
      });
    }
    if (sorts == "asc")
      restaurants = restaurants.sort((a, b) => {
        sorts = "A-Z";
        return a.name > b.name ? 1 : -1;
      });
    else if (sorts == "desc")
      restaurants = restaurants.sort((a, b) => {
        sorts = "Z-A";
        return a.name > b.name ? -1 : 1;
      });
    else if (sorts == "rating")
      restaurants = restaurants.sort((a, b) => {
        sorts = "評分";
        return a.rating > b.rating ? -1 : 1;
      });
    else if (sorts == "area")
      restaurants = restaurants.sort((a, b) => {
        sorts = "地區";
        return a.location > b.location ? 1 : -1;
      });
    return res.render(`index`, {
      restaurants: restaurants,
      keywords: keywords,
      sorts: sorts
    });
  });
});
module.exports = router;
