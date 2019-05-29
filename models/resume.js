var mongoose = require("mongoose");

var ResumeSchema = new mongoose.Schema({
  filename: String,
  url: String,
  username: String,
  last_updated: Date,
  tags: [{
    type: String
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  description: String,
  raters: [{ type: String }],
  ratings: [{ type: Number }],
  overall_rating: Number,
  successful: Boolean
});

// return model as object
module.exports = mongoose.model("Resume", ResumeSchema);
