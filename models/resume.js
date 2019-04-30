var mongoose = require("mongoose");

var ResumeSchema = new mongoose.Schema({
  filename: String,
  url: String,
  last_updated: Date,
  tags: [{
    type: String
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

// return model as object
module.exports = mongoose.model("Resume", ResumeSchema);
