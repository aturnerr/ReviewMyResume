var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
  text: String,
  author:{
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
});

// return model as object
module.exports = mongoose.model("Comment", CommentSchema);
