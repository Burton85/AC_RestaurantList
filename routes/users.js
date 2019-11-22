const express = require("express");
const router = express.Router();
const userDB = require("../models/users");
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res) => {
  res.redirect("/");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {
  res.redirect("/");
});
module.exports = router;
