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
    resumes:[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Resume"
                }
            ],
    notifications:[
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Notification"
                    }
                  ],
    num_requests:{
                    type: Number,
                    default: 5
                 },
    started_walkthroughs:   {
                                type: [Boolean],
                                default: [false, false, false, false]
                            },
    completed_walkthroughs: {
                                type: [Boolean],
                                default: [false, false, false, false]
                            }
});

// defines the serialize/ deserialize methods for the user automatically
UserSchema.plugin(passportLocalMongoose);

// return model as object
module.exports = mongoose.model("User", UserSchema);
