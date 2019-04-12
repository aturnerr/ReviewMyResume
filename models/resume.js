var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var TagSchema = new mongoose.Schema({
  tag: String
});

var ResumeSchema = new mongoose.Schema({
  username: String,
  file_title: String,
  file_URL: String,
  created_at: Date,
  tags: {
    type: TagSchema
  }
});

// defines the serialize/ deserialize methods for the user automatically
TagSchema.plugin(passportLocalMongoose);
ResumeSchema.plugin(passportLocalMongoose);

// return model as object
module.exports = mongoose.model("Tag", TagSchema);
module.exports = mongoose.model("Resume", ResumeSchema);
