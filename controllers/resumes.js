const Resume            = require("../models/resume"),
      Comment           = require("../models/comment"),
      Notification      = require("../models/notification");
      fs                = require('fs'),
      User              = require("../models/user"),
      Canvas            = require('canvas'),
      assert            = require('assert'),
      pdfjsLib          = require('pdfjs-dist');

const {Storage} = require('@google-cloud/storage');
const config = require('../config');
const CLOUD_BUCKET = config.get('CLOUD_BUCKET');
const storage = new Storage({
  projectId: 'my-project-1557648191606',
  keyFilename: './key.json'
});
const bucket = storage.bucket(CLOUD_BUCKET);

const MIN_DESC_LENGTH = 50;
const MAX_DESC_LENGTH = 200;
const tags = ["Agriculture", "Accounting" ,"Aeronautical Engineering", "Architecture", "Building",
"Business Studies", "Chemical Engineering", "Chemistry", "Civil Engineering", "Computer Science",
"Dentistry", "Economics", "Education Initial", "Education Post Other", "Electrical Engineering",
"Electronic Computer Engineering", "Geology", "Health Other", "Humanities","Languages", "Law",
"Life Sciences", "Mathematics", "Mechanical Engineering", "Medicine", "Mining Engineering",
"Nursing Initial", "Nursing Post Initial", "Other Engineering", "Pharmacy", "Physical Sciences",
"Psychology", "Rehabilitation", "Social Sciences", "Social Work", "Surveying",
"Urban Regional Planning", "Veterinary Science", "Visual Performing Arts"];

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    assert(width > 0 && height > 0, 'Invalid canvas size');
    var canvas = Canvas.createCanvas(width, height);
    var context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context,
    };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');
    assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

exports.show_upload_page =

    (req, res) => {
        res.render('upload-resume', {
                                        description: "",
                                        retry: false,
                                        page: "upload",
                                        user_type: req.user.type
                                    });
    }

exports.show_resume_gallery =

    (req, res) => {
        Resume.find((err, resumes) => {
        if (!err) {
            if (req.params.tag){
              res.render("resume-gallery", {resumes: resumes, page: "gallery", tag: req.params.tag, user_type: req.user.type});
            } else {
              res.render("resume-gallery", {resumes: resumes, page: "gallery", tag: "", user_type: req.user.type});
            }
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

        Resume.findById(req.params.id).populate('comments').exec((err, resume) => {

          if (err || !resume){
            req.flash("Sorry, that resume does not exist!");
            res.redirect("/resumes");
          }

          res.render("show-resume", {resume: resume, page: "resume", user_type: req.user.type});
        });
    }

exports.upload_resume =

    (req, res) => {

      // ensure that primary tag is valid
      if ((!tags.includes(req.body.primary_tag)) || (req.body.secondary_tag && !tags.includes(req.body.secondary_tag))){

          return res.render('upload-resume', {
                                                primary_tag: "",
                                                secondary_tag: "",
                                                description: req.body.description,
                                                error: "You entered an invalid tag!",
                                                retry: true,
                                                page: "upload",
                                                user_type: req.user.type
                                            });
      }

      // ensure that secondary tag is valid
      if ((req.body.secondary_tag !== "") && (!tags.includes(req.body.secondary_tag))){

        return res.render('upload-resume', {
                                              primary_tag: req.params.primary_tag,
                                              secondary_tag: "",
                                              description: req.body.description,
                                              error: "You entered an invalid tag!",
                                              retry: true,
                                              page: "upload",
                                              user_type: req.user.type
                                          });
    }

      // ensure that tags aren't the same
      if (req.body.primary_tag == req.body.secondary_tag){

          return res.render('upload-resume', {
                                              primary_tag: "",
                                              secondary_tag: "",
                                              description: req.body.description,
                                              error: "Both your tags can't be the same!",
                                              retry: true,
                                              page: "upload",
                                              user_type: req.user.type
                                            });
      }

      // validate length of description
      if (req.body.description.length < MIN_DESC_LENGTH || req.body.description.length > MAX_DESC_LENGTH){
          return res.render('upload-resume', {
                                                primary_tag: req.body.primary_tag,
                                                secondary_tag: req.body.secondary_tag,
                                                description: "",
                                                error: "The description must be between 50 to 200 characters!",
                                                retry: true,
                                                page: "upload",
                                                user_type: req.user.type
                                              });
      }

      // sanitise description
      var description = req.sanitize(req.body.description);

      // upload resume to storage
      var gcsname = exports.uploadGCS(req, res);

      // create a new entry for the database
      const resume = new Resume({
          filename: req.file.filename,
          // url: req.file.path,
          last_updated: Date.now(),
          username: req.user.username,
          user_type: req.user.type,
          description: description
      })

      // push tags
      resume.tags.push(req.body.primary_tag);
      if (req.body.secondary_tag) {
        resume.tags.push(req.body.secondary_tag);
      };

      // upload to database
      resume.save();

      // link with user
      User.findOneAndUpdate(  { _id: req.user._id },
                              { $push: { resumes: resume } },
                              function (err, success) {
          if (err) {
            // console.log(err);
          } else {
            // console.log(success);
            req.flash("success", "Your Resume Was Successfully Uploaded!");
            res.redirect("/dashboard");
          }
        });

      // multer memory buffer
      var rawData = req.file.buffer;

      // Load the PDF file.
      var loadingTask = pdfjsLib.getDocument(rawData);
      loadingTask.promise.then(function(pdfDocument) {

        // Get the first page.
        pdfDocument.getPage(1).then(function (page) {
          // Render the page on a Node canvas with 100% scale.
          var viewport = page.getViewport(1.0);
          var canvasFactory = new NodeCanvasFactory();
          var canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
          var renderContext = {
            canvasContext: canvasAndContext.context,
            viewport: viewport,
            canvasFactory: canvasFactory,
          };

          var renderTask = page.render(renderContext);
          renderTask.promise.then(function() {
            // Convert the canvas to an image buffer.
            var image = canvasAndContext.canvas.toBuffer();
            // upload to storage
            exports.uploadThumbGCS(req, image);
          });
        });
      }).catch(function(reason) {
        // console.log(reason);
      });

    }

function getPublicUrl (filename) {
  return `https://storage.googleapis.com/reviewmyresume/${filename}`;
}

// next two functions can probably be merged later on..
exports.uploadThumbGCS =
  (req, image) => {
    const gcsname = req.file.filename + ".png";
    const file = bucket.file(gcsname);
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/png'
      },
      resumable: false
    });

    stream.on('error', (err) => {
      req.file.cloudStorageError = err;
    });

    stream.on('finish', () => {
      req.file.cloudStorageObject = gcsname;
    });

    stream.end(image);
  }

exports.uploadGCS =
  (req, res) => {
    const gcsname = req.file.filename;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      },
      resumable: false
    });

    stream.on('error', (err) => {
      req.file.cloudStorageError = err;
      // next(err);
    });

    stream.on('finish', () => {
      req.file.cloudStorageObject = gcsname;
    });

    stream.end(req.file.buffer);
    return gcsname;
  }

exports.post_comment =

  (req, res) => {
      Resume.findById(req.params.id, (err, resume) => {

        if (err || !resume){
          res.flash("Sorry, that resume does not exist!");
          res.redirect("/resumes");
        }

        // CREATE COMMENT

        // --  add additional info
        var author = {
          id: req.user.id,
          username: req.user.username
        };

        req.body.comment.author = author;
        req.body.comment.type = req.user.type === "student" ? "comment" : "review";

        Comment.create(req.body.comment, function(err, comment){

          if (err){
            req.flash("error", "Sorry, your request couldn't be completed at this \
                                                                        time.");
            res.redirect("/resumes/" + req.params.id);
          } else {
            resume.comments.push(comment);
            resume.save();
          }
        });

        // CREATE NOTIFICATION if commented not author

        if (req.user.username !== resume.username){
          var snippet;
          if (req.user.type === "student"){
            if (req.body.comment.text.length > 21){
              snippet = req.body.comment.text.substring(0, 18) + "...";
            } else {
              snippet = req.body.comment.text.substring(0, 21);
            }
          } else {
            if (req.body.comment.text.length > 25){
              snippet = req.body.comment.text.substring(0, 22) + "...";
            } else {
              snippet = req.body.comment.text.substring(0, 25);
            }
          }

          var notification = {
            to: resume.username,
            from: author.username,
            type: req.user.type,
            text_snippet: snippet,
            resume: resume
          }

          Notification.create(notification, function(err, notification_){
            if (err){
              req.flash("error", "Sorry, your request couldn't be completed at this \
                                                                          time.");
              res.redirect("/resumes/" + req.params.id);
            }
          });
        }

        res.redirect("/resumes/" + req.params.id);
      });
  }

exports.delete_comment =

  (req, res) => {

      Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err){
            req.flash("error", "Oops something went wrong!")
            res.redirect("/resumes/" + req.params.id);
        } else {
          req.flash("success", "Your comment was removed.");
          res.redirect("/resumes/" + req.params.id);
        }
      });
  }

exports.delete_resume =

    (req, res) => {
      Resume.findById(req.params.id).exec((err, resume) => {
        if (!err) {
          storage.bucket(CLOUD_BUCKET).file(resume.filename).delete();
          storage.bucket(CLOUD_BUCKET).file(resume.filename + '.png').delete();
        }
      });
      // delete from database
      Resume.findByIdAndRemove(req.params.id, (err) => {
        if (err){
          req.flash("error", "Oops something went wrong!");
          res.redirect("/dashboard");
        } else {
          req.flash("success", "Your resume was deleted.");
          res.redirect("/dashboard");
        }
      });
  }

 exports.show_edit_resume =

    (req, res) => {

      Resume.findById(req.params.id).exec((err, resume) => {

        if (err || !resume){
          req.flash("Sorry, that resume does not exist!");
          res.redirect("/resumes");
        }

        res.render("edit-resume", {resume: resume, retry: false, page: "edit", user_type: req.user.type});

      });
    }

exports.edit_resume =

  (req, res) => {
    const id = req.params.id;
    const new_primary_tag = req.body.primary_tag;
    const new_secondary_tag = req.body.secondary_tag;
    const new_desc = req.body.description;

    Resume.findOneAndUpdate({_id: id}, {
      $set:{ description: new_desc,
            "tags.0": new_primary_tag,
            "tags.1": new_secondary_tag
          }},
            { new: true }, (err, resume) => {
      if (!err) {
        res.redirect("/resumes/" + id);
      }
    });
  }

exports.add_rating =

  (req, res) => {

      Resume.findById(req.params.id, (err, resume) => {

        resume.raters.push(req.user.username);
        resume.ratings.push(req.body.rating);

        var sum = 0;
        for (var i=0; i<resume.ratings.length; i++){
          sum += resume.ratings[i];
        }
        resume.overall_rating = Math.round(sum / resume.ratings.length);

        resume.save();
      });

      res.redirect("/resumes/" + req.params.id);
  }

exports.delete_notif =

  (req, res) => {
    Notification.findByIdAndRemove(req.params.id, (err) => {
      if (err){
          req.flash("error", "Oops something went wrong!")
          res.redirect("/dashboard");
      } else {
        req.flash("success", "Notification successfully deleted.");
        res.redirect("/dashboard");
      }
    });
  }