var mongoose              = require("mongoose"),
    express               = require('express'),
    crypto                = require('crypto'),
    multer                = require('multer'),
    path                  = require('path'),
    fs                    = require('fs');
    // pdf2png               = require('pdf2png');
    Resume                = require("../models/resume")

var router = express.Router();

/*================================ FILE STORAGE ==============================*/

// multer storage options
const storage = multer.diskStorage({
  // where to store the file
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  // what to call each file
  filename: function(req, file, cb) {
    // concatenate current time + filename
    cb(null, new Date().toISOString().replace(/:|\./g,'-') + '-' + file.originalname);
  }
});

// define filter constraints for multer
const fileFilter = (req, file, cb) => {
  // check if of type filter
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  }
  else {
    // need to send a message to user if this fails
    cb(null, false);
  }
};

// initialise main multer constant
const upload = multer({
  storage,
  // set file size limits
  limits: {
    // 10MB
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

/*=================================GET ROUTES=================================*/

// standard resume upload page and form
router.get('/resumes/upload', isLoggedIn, (req, res) => {
    res.render('upload');
});

// list of all currently stored resumes
router.get('/resumes', isLoggedIn, (req, res) => {
  Resume.find((err, resumes) => {
    if (!err) {
      res.render("resumes", {resumes: resumes});
    } else {
      res.sendStatus(404);
    }
  });
});

// view a specific pdf in the browser
router.get('/resumes/:filename', isLoggedIn, (req, res) => {
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
      console.log("== Entry in database found");
      // check local file system
      if (fs.existsSync("uploads/" + filename)) {
        console.log("== Entry in file system found");
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
        console.log("== Error, entry not in file system")
        res.status(500).json({
          message: 'Resume file not found'
        });
      }
    }

  });
});

router.get('/resumes/delete/:filename', isLoggedIn, (req, res) => {
  const filename = req.params.filename;
  // delete from database
  Resume.deleteOne({filename: filename}, (err, result) => {
    if (!err) {
      res.status(200).json({
        message: 'Resume deleted',
      });
    } else {
      console.log(err);
      res.status(500).json({
        message: 'Resume not found'
      });
    }
  });
  // delete from file system
  fs.unlink("uploads/" + filename, (err) => {
    if (!err) {
      console.log('File deleted.')
    } else {
      console.log('File not deleted.')
    }
  })
});

/*================================POST ROUTES=================================*/

// route for uploading the file
router.post('/resumes/upload', isLoggedIn, upload.single("file"), (req, res) => {
    console.log(req.file);
    // create a new entry for the database
    const resume = new Resume({
      user: "test",
      filename: req.file.filename,
      url: req.file.path,
      last_updated: Date.now(),
      // need to have a way of defining these somewhere else.
      tags: ["tag1", "tag2"]
    })


    // upload to database
    resume.save()
    // redirect back to home page (or a success page?)
    res.redirect("/resumes")
});

/*=================================MIDDLEWARE=================================*/

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }

  res.redirect("/login");
}

module.exports = router;
