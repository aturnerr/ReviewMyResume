const Resume            = require("../models/resume"),
      Comment           = require("../models/comment"),
      fs                = require('fs'),
      User              = require("../models/user"),
      Canvas            = require('canvas'),
      assert            = require('assert'),
      pdfjsLib          = require('pdfjs-dist');


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
                                        retry: false
                                    });
    }

exports.show_resume_gallery =

    (req, res) => {
        Resume.find((err, resumes) => {
        if (!err) {
            res.render("resume-gallery", {resumes: resumes});
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
            res.flash("Sorry, that resume does not exist!");
            res.redirect("/resumes");
          }
          
          res.render("show-resume", {resume: resume});
        });
    }

exports.upload_resume =

    (req, res) => {

      // // ensure that a file was uploaded
      // if (!req.body.filename || req.body.filename.length ==0){
      //     return res.render('upload-resume', {
      //                                           primary_tag: req.body.primary_tag,
      //                                           secondary_tag: req.body.secondary_tag,
      //                                           description: req.body.description,
      //                                           error: "You didn't upload a file!",
      //                                           retry: true
      //                                       });
      // }
        
      // ensure that tags are valid
      if ((!tags.includes(req.body.primary_tag)) || (!tags.includes(req.body.secondary_tag))){

          return res.render('upload-resume', {
                                                primary_tag: "",
                                                secondary_tag: "",
                                                description: req.body.description,
                                                error: "You entered an invalid tag!",
                                                retry: true
                                            });
      }

      // ensure that tags aren't the same
      if (req.body.primary_tag == req.body.secondary_tag){

          return res.render('upload-resume', {
                                              primary_tag: "",
                                              secondary_tag: "",
                                              description: req.body.description,
                                              error: "Both your tags can't be the same!",
                                              retry: true
                                            });
      }

      // validate length of description
      if (req.body.description.length < MIN_DESC_LENGTH || req.body.description.length > MAX_DESC_LENGTH){
          return res.render('upload-resume', {
                                                primary_tag: req.body.primary_tag,
                                                secondary_tag: req.body.secondary_tag,
                                                description: "",
                                                error: "The description must be between 50 to 200 characters!",
                                                retry: true
                                              });
      }

      // sanitise description
      var description = req.sanitize(req.body.description);

      // create a new entry for the database
      const resume = new Resume({
          filename: req.file.filename,
          url: req.file.path,
          last_updated: Date.now(),
          username: req.user.username,
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

      // Relative path of the PDF file.
      var pdfURL = 'public/uploads/' + req.file.filename;

      // Read the PDF file into a typed array so PDF.js can load it.
      var rawData = new Uint8Array(fs.readFileSync(pdfURL));

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
            fs.writeFile('public/thumbs/' + req.file.filename + '.png', image, function (error) {
              if (error) {
                // console.error('Error: ' + error);
              }
            });
          });
        });
      }).catch(function(reason) {
        // console.log(reason);
      });

    }

exports.post_comment =
  
  (req, res) => {
      Resume.findById(req.params.id, (err, resume) => {
        
        if (err || !resume){
          res.flash("Sorry, that resume does not exist!");
          res.redirect("/resumes");
        }
        
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
          }

          resume.comments.push(comment);
          resume.save();

          res.redirect("/resumes/" + req.params.id);
        });
      });
  }

exports.delete_comment = 

  (req, res) => {

      Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err){
            req.flash("Oops something went wrong!")
            res.redirect("/resumes/" + req.params.id);
        }

        req.flash("Your comment was removed.");
        res.redirect("/resumes/" + req.params.id);
      });
  }

exports.delete_resume = 

  (req, res) => {

      const filename = req.params.filename;
      
      // delete from database
      Resume.deleteOne({filename: filename}, (err, result) => {
        if (!err) {
          res.status(200).json({
            message: 'Resume deleted',
          });
        } else {
          res.status(500).json({
            message: 'Resume not found'
          });
        }
      });

      // delete from file system
      fs.unlink("uploads/" + filename, (err) => {
        if (!err) {
          console.log('File deleted.'); // remove this later
        } else {
          console.log('File not deleted.'); // remove this later
        }
      })
  }
