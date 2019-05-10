var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
  text: String,
  author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },
  date: {
      type: Date,
      default: Date.now
  },
  n_upvotes: Number,
  n_downvotes: Number
});

// return model as object
module.exports = mongoose.model("Comment", CommentSchema);
