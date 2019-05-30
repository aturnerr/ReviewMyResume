var mongoose = require("mongoose");

var ResumeSchema = new mongoose.Schema({
  filename: String,
  url: String,
  username: String,
  user_type: String,
  last_updated: {
                  type: Date,
                  default: Date.now
                },
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
