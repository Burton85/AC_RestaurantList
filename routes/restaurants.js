const express = require("express");
const router = express.Router();
const RestaurantDB = require("../models/restaurant");

//Go to show page
router.get("/:id", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("show error");
    const restaurantsResults = restaurants.filter(
      item => item._id.toString() === req.params.id
    );
    res.render("show", { restaurant: restaurantsResults[0] });
  });
});
//edit page
router.get("/:id/edit", (req, res) => {
  RestaurantDB.find((err, restaurants) => {
    if (err) return console.log("error");
    const restaurantsResults = restaurants.filter(
      item => item._id.toString() === req.params.id
    );
    res.render("edit", { restaurant: restaurantsResults[0] });
  });
});
router.put("/:id/edit", (req, res) => {
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
router.delete("/:id/delete", (req, res) => {
  const restaurantId = req.params.id;
  RestaurantDB.findById(restaurantId, (err, restaurant) => {
    restaurant.remove(err => {
      if (err) return console.log("remove error");
      return res.redirect("/");
    });
  });
});

module.exports = router;
