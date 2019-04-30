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

exports.upload_resume = 

    (req, res) => {

        Section.create(req.body.section, function(err, section){
            // console.log(req.body.section);
            if (err){
                console.log(err);
                req.flash("error", "Sorry, your request couldn't be completed at this \
                                                                    time.")
                res.redirect("/projects/current");
            }
            project.sections.push(section);
            project.save();
            res.redirect("/projects/show/:id");
        });

        // create a new entry for the database
        const resume = new Resume({
            filename: req.file.filename,
            url: req.file.path,
            last_updated: Date.now(),
            // need to have a way of defining these somewhere else.
            tags: ["tag1", "tag2"]
        })
    
        // upload to database
        resume.save();

        // link with user
        User.findById(req.user._id, function(err, user){
            if (err){
                req.flash("error", "Oops something went wrong!");
                res.redirect("/upload");
            }

            user.resumes.push(resume);

            req.flash("success", "resume successfully added!");
            res.redirect("/dashboard");
        });
    }