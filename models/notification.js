var mongoose = require("mongoose");

var NotificationSchema = new mongoose.Schema({
    to: String,
    from: String,
    type: String,
    text_snippet: String,
    resume:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Resume"
           },
    date:{
            type: Date,
            default: Date.now
         }
});

// return model as object
module.exports = mongoose.model("Notification", NotificationSchema);
