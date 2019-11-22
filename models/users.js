//resources from :https://mongoosejs.com/docs/validation.html
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    require: [true, "User name number required"],
    unique: true
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    validate: {
      validator: () => Promise.resolve(false),
      message: "Email validation failed"
    },
    require: [true, "User email number required"]
  },
  password: {
    type: String,
    require: [true, "User password number required"]
  },
  restaurant_id: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.new
  }
});
//export the model named Users
module.exports = mongoose.model("Users", userSchema);
