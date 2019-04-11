var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var ReviewerSchema = new mongoose.Schema({
    username: String,
    password: String,
    fname: String, 
    lname: String,
    email: String, 
    company: String, 
    linkedIn: String, 
    country: String
});

// defines the serialize/ deserialize methods for the user automatically
ReviewerSchema.plugin(passportLocalMongoose);

// return model as object
module.exports = mongoose.model("Reviewer", ReviewerSchema);
