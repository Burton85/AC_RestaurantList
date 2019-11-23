// Require packages from node
const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const RestaurantDB = require("./models/restaurant.js");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const flash = require("connect-flash");

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
mongoose.connect("mongodb://127.0.0.1/Restaurant", { useNewUrlParser: true });
db = mongoose.connection;
db.on("error", () => {
  console.log("db error");
});
db.once("open", () => {
  console.log("db connected");
});
// setting the certification system
app.use(
  session({
    secret: "acb",
    resave: false,
    saveUninitialized: true
  })
);
//init passport
app.use(passport.initialize());
app.use(passport.session());
//init flash
app.use(flash());
//不太明白這裡的用意，是渲染，是渲染嗎?
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.success_msg = req.flash("success_msg").toString();
  res.locals.warning_msg = req.flash("warning_msg").toString();
  next();
});

//routes
app.use("/restaurants", require("./routes/restaurants.js"));
app.use("/", require("./routes/home.js"));
app.use("/users", require("./routes/users.js"));

app.listen(port, () => {
  console.log(`express is listening on the port:${port}`);
});
