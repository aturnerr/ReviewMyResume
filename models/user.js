var mongoose = require("mongoose");

var userSchema = mongoose.Schema(
  {
    "name": String,
    "email": String,
    "phone": String
  }
);

mongoose.model("users", userSchema);
