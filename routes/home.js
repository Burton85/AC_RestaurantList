const express = require("express");
const router = express.Router();
const RestaurantDB = require("../models/restaurant");
const { authenticated } = require("../config/auth");

//餐廳總攬
router.get("/", authenticated, (req, res) => {
  const keywords = req.query.keywords;
  let sorts = req.query.sorts;

  RestaurantDB.find(
    { public: true } || { userId: req.user._id },
    (err, restaurants) => {
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
    }
  );
});
// 最愛的餐廳
router.get("/favorite", authenticated, (req, res) => {
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
// 我的餐廳
router.get("/private", authenticated, (req, res) => {
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

//Create new restaurant
router.get("/new", authenticated, (req, res) => {
  console.log(req.user);
  res.render("new");
});

router.post("/new", authenticated, (req, res) => {
  const Info = req.body;
  let errors = [];
  // const imgReg = /(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
  const phoneReg = /^09[0-9]{8}$/;
  const rateReg = /[1-9]\d*.\d*|0.\d*[1-9]\d*|[1-9]\d*/;
  if (
    !Info.name ||
    !Info.name_en ||
    !Info.category ||
    !Info.location ||
    !Info.phone ||
    !Info.description ||
    !Info.image ||
    !Info.rating ||
    !Info.location
  ) {
    errors.push({ message: "Please fill the necessary field up!" });
  }
  if (!phoneReg.test(Info.phone)) {
    errors.push({ message: "Please input a valid phone number" });
  } //check if phone not number
  if (!rateReg.test(Info.rating) || !(0 <= parseFloat(Info.rating, 10) <= 5)) {
    console.log(parseFloat(Info.rating, 10) < 5);
    errors.push({
      message: "Please input a valid rating score between 0 to 5 "
    });
  } //check if rating not number
  // if (!imgReg.test(Info.image)) {
  //   errors.push({ message: "Please input a valid image url" });
  // }
  if (errors.length > 0) {
    res.render("new", {
      errors,
      Info
    });
  } else {
    const newRestaurant = RestaurantDB({
      userId: req.user._id,
      name: Info.name,
      name_en: Info.name_en,
      category: Info.category,
      location: Info.location,
      phone: Info.phone,
      description: Info.description,
      image: Info.image,
      rating: Info.rating,
      google_map: "https://www.google.com/maps/place/" + Info.location
    });
    if (Info.public == "disagree") {
      newRestaurant.public = false;
    }
    newRestaurant.save(err => {
      if (err) return console.log(err);
      return res.redirect(`/restaurants/${newRestaurant._id}`);
    });
  }
});

module.exports = router;
