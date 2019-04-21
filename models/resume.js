var mongoose = require("mongoose");

var ResumeSchema = new mongoose.Schema({
  uid: String,
  file_URL: String,
  created_at: Date,
  tags: [{
    type: String
  }]
});

// return model as object
module.exports = mongoose.model("Resume", ResumeSchema);
