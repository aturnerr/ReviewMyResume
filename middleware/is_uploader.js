const Resume = require("../models/resume");

module.exports =

    // checks if the user making the update is the same as the one who created
    // the resume
    function isUploader(req, res, next){
        Resume.findById(req.params.id).exec((err, resume) => {
          if (req.user.username == resume.username){
              return next();
          }
          res.redirect("/resumes/" + req.params.id);
        });
    }
