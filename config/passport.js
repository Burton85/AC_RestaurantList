const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const mongoose = require("mongoose");
const UserDB = require("../models/users");
const bcrypt = require("bcryptjs");

const passports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      UserDB.findOne({ email, email }).then(user => {
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          else if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Email or Password incorrect"
            });
          }
        });
      });
    })
  );
  //序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    UserDB.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

module.exports = passports;
