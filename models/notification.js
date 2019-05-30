var mongoose = require("mongoose");

var NotificationSchema = new mongoose.Schema({
    to: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    from: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// return model as object
module.exports = mongoose.model("Notification", NotificationSchema);
