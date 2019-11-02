// require packages from node
const express = require("express");
const app = express();
const port = 3000;
const restaurantlist = require("./restaurant.json");
const exphbs = require("express-handlebars");

//setting handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//use static files
app.use(express.static("public"));

//setting routes
app.get("/", (req, res) => {
  const rslist = restaurantlist.results;
  res.render(`index`, { restaurants: rslist });
});
//setting search bar
app.get("/search", (req, res) => {
  const keywords = req.query.keyword;
  const rsresult = restaurantlist.results.filter(item => {
    return (
      item.name.toLowerCase().includes(keywords.toLowerCase()) ||
      item.name_en.toLowerCase().includes(keywords.toLowerCase())
    );
  });

  res.render("index", { restaurants: rsresult, keywords: keywords });
});
//go to show page
app.get("/restaurants/:id", (req, res) => {
  const restaurant = restaurantlist.results.filter(
    item => item.id.toString() === req.params.id
  );
  res.render("show", { restaurant: restaurant[0] });
});

app.listen(port, () => {
  console.log(`express is listening on the port:${port}`);
});
