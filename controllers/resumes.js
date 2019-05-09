const Resume            = require("../models/resume"),
      fs                = require('fs'),
      User              = require("../models/user");


const tags = ["Agriculture", "Accounting" ,"Aeronautical Engineering", "Architecture", "Building", 
"Business Studies", "Chemical Engineering", "Chemistry", "Civil Engineering", "Computer Science", 
"Dentistry", "Economics", "Education Initial", "Education Post Other", "Electrical Engineering", 
"Electronic Computer Engineering", "Geology", "Health Other", "Humanities","Languages", "Law", 
"Life Sciences", "Mathematics", "Mechanical Engineering", "Medicine", "Mining Engineering", 
"Nursing Initial", "Nursing Post Initial", "Other Engineering", "Pharmacy", "Physical Sciences", 
"Psychology", "Rehabilitation", "Social Sciences", "Social Work", "Surveying", 
"Urban Regional Planning", "Veterinary Science", "Visual Performing Arts"];

exports.show_upload_page =

    (req, res) => {
        res.render('upload');
    }

exports.show_resume_gallery =

    (req, res) => {
        Resume.find((err, resumes) => {
        if (!err) {
            res.render("resumes", {resumes: resumes});
        } else {
            res.sendStatus(404);
        }
        });
    }

exports.show_resume_pdf =

    (req, res) => {
        const filename = req.params.filename;
        Resume.find({filename:filename}, (err, resume) => {
        // check if the function returned any results
        if (!resume.length){
            res.status(500).json({
            message: 'Resume not found'
            });
        }
        // if it has, need to check if the file itself exists
        else {
            // check local file system
            if (fs.existsSync("uploads/" + filename)) {
            // stream the file data
            var file = fs.createReadStream("uploads/" + filename);
            var stat = fs.statSync("uploads/" + filename);
            // define the http headers to load the file in browser
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            // send through response
            file.pipe(res);
            } else {
            // file entry is in database, but local pdf doesn't exist
            res.status(500).json({
                message: 'Resume file not found'
            });
            }
        }

        });
    }

exports.view_resume =
    (req, res) => {
        const _id = req.params._id;
        Resume.find({_id:_id}, (err, resume) => {
          // check if the function returned any results
          if (!resume.length){
              res.status(500).json({
              message: 'Resume not found'
              });
          }
          // if it has, need to check if the file itself exists
          else {
            res.render("resume", {resume: resume});
          }
        });
    }

exports.upload_resume =

    (req, res) => {
        // validate primary tag
        if (!tags.includes(req.body.primary_tag)){
            
            return res.render('upload', {
                                    primary_tag: req.body.primary_tag,
                                    secondary_tag: req.body.secondary_tag,
                                    description: req.body.description,
                                    error: "Invalid primary tag!",  
                                    retry: true
                                });
        }
        // validate file is pdf

        // create a new entry for the database
        const resume = new Resume({
            filename: req.file.filename,
            url: req.file.path,
            last_updated: Date.now(),
            username: req.user.username,
            description: req.body.description
        })
        // push tags
        resume.tags.push(req.body.primary_tag);
        if (req.body.secondary_tag) {
          resume.tags.push(req.body.secondary_tag);
        };
        // upload to database
        resume.save();


        // User.findById(req.user._id, function(err, user){
        //     if (err){
        //         req.flash("error", "Oops something went wrong!");
        //         res.redirect("/upload");
        //     }
        //     user.resumes.push(resume);
        //
        //     req.flash("success", "resume successfully added!");
        //     res.redirect("/dashboard");
        // });

        // link with user
        User.findOneAndUpdate(  { _id: req.user._id },
                                { $push: { resumes: resume } },
                                function (err, success) {
            if (err) {
              console.log(err);
            } else {
              // console.log(success);
              req.flash("success", "resume successfully added!");
              res.redirect("/dashboard");
            }
          });
    }
