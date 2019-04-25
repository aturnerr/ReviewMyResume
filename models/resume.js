var mongoose = require("mongoose");

var ResumeSchema = new mongoose.Schema({
  user: String,
  filename: String,
  url: String,
  last_updated: Date,
  tags: [{
    type: String
  }]
});

// return model as object
module.exports = mongoose.model("Resume", ResumeSchema);
