const Resume            = require("../models/resume"),
      fs                = require('fs'),
      User              = require("../models/user"),
      Canvas            = require('canvas'),
      assert            = require('assert'),
      pdfjsLib          = require('pdfjs-dist');

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
            console.log(resume);
            res.render("resume", {resume: resume[0]});
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

        // link with user
        User.findOneAndUpdate(  { _id: req.user._id },
                                { $push: { resumes: resume } },
                                function (err, success) {
            if (err) {
              console.log(err);
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
                  console.error('Error: ' + error);
                }
              });
            });
          });
        }).catch(function(reason) {
          console.log(reason);
        });

    }

exports.post_comment =
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
