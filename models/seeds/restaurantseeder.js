//import modules
const mongoose = require("mongoose");
const RestaurantDB = require("../restaurant.js");
const UserDB = require("../users");
const restaurantJson = require("../restaurant.json");
const restaurants = restaurantJson.restaurants;
const users = restaurantJson.users;
const bcrypt = require("bcryptjs");

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

  for (let i = 0; i < restaurants.length; i++) {
    RestaurantDB.create({
      name: restaurants[i].name,
      name_en: restaurants[i].name_en,
      category: restaurants[i].category,
      image: restaurants[i].image,
      location: restaurants[i].location,
      phone: restaurants[i].phone,
      google_map: restaurants[i].google_map,
      rating: restaurants[i].rating,
      description: restaurants[i].description
    });
  }

  for (let i = 0; i < users.length; i++) {
    const newUser = new UserDB({
      name: users[i].name,
      email: users[i].email,
      password: users[i].password,
      phone: users[i].phone
    });
    //hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        //save the new user
        newUser
          .save()
          .then(user => {
            console.log("user create");
          })
          .catch(err => console.log(err));
      });
    });
  }
  RestaurantDB.find((err, restaurant) => {
    console.log(restaurant[0]._id);
    UserDB.updateOne(
      { name: "d" },
      { $push: { restaurant_id: restaurant[0]._id } }
    );
  });
});
