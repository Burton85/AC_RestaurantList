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

    for (let j = i; j < restaurants.length; j += 2) {
      RestaurantDB.create({
        name: restaurants[j].name,
        name_en: restaurants[j].name_en,
        category: restaurants[j].category,
        image: restaurants[j].image,
        location: restaurants[j].location,
        phone: restaurants[j].phone,
        google_map: restaurants[j].google_map,
        rating: restaurants[j].rating,
        description: restaurants[j].description,
        userId: newUser._id
      });
    }
    // RestaurantDB.find((err, restaurant) => {
    //   console.log(restaurant[0]);
    //   UserDB.updateOne(
    //     { name: "d" },
    //     { $push: { restaurant_id: restaurant[0] } }
    //   );
    // });
  }
});
