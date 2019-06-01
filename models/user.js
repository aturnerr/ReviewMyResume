var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    fname: String,
    lname: String,
    email: String,
    occupation: String,
    company: String,
    country: String,
    type: String,
    resumes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Resume"
                }
            ],
    notifications: [
                        {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Notification"
                        }
                    ],
    num_requests: Number
});

// defines the serialize/ deserialize methods for the user automatically
UserSchema.plugin(passportLocalMongoose);

// return model as object
module.exports = mongoose.model("User", UserSchema);
