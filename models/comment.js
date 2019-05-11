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
  type: String,
  n_upvotes:{
                type: Number,
                default: 0
            },
  n_downvotes:{
                type: Number,
                default: 0
              }
});

// return model as object
module.exports = mongoose.model("Comment", CommentSchema);
