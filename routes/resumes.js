const Resume            = require("../models/resume"),
      passport          = require("passport"),
      express           = require("express"),
      multer            = require('multer'),
      path              = require('path'),
      fs                = require('fs'),
      router            = express.Router(),
      isLoggedIn        = require("../middleware/is_logged_in"),
      ResumesController = require("../controllers/resumes");

/*================================ FILE STORAGE ==============================*/

// multer storage options
const storage = multer.diskStorage({
  // where to store the file
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  // what to call each file
  filename: function(req, file, cb) {
    // concatenate current time + filename
    cb(null, new Date().toISOString().replace(/:|\./g,'-') + '-' +
                                                            file.originalname);
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
router.get('/resumes/upload', isLoggedIn, ResumesController.show_upload_page);

// list of all currently stored resumes
router.get('/resumes', isLoggedIn, ResumesController.show_resume_gallery);

// view a specific pdf in the browser
router.get('/resumes/pdf/:filename', isLoggedIn, ResumesController.show_resume_pdf);

router.get('/resumes/:_id', isLoggedIn, ResumesController.view_resume);

// THIS IS WRONG - should be a router.delete (we need a form for it)
// router.get('/resumes/delete/:filename', isLoggedIn, (req, res) => {
//   const filename = req.params.filename;
//   // delete from database
//   Resume.deleteOne({filename: filename}, (err, result) => {
//     if (!err) {
//       res.status(200).json({
//         message: 'Resume deleted',
//       });
//     } else {
//       console.log(err);
//       res.status(500).json({
//         message: 'Resume not found'
//       });
//     }
//   });
//   // delete from file system
//   fs.unlink("uploads/" + filename, (err) => {
//     if (!err) {
//       console.log('File deleted.')
//     } else {
//       console.log('File not deleted.')
//     }
//   })
// });

/*================================POST ROUTES=================================*/

// route for uploading the file
router.post('/resumes/upload', isLoggedIn, upload.single("file"),
                                              ResumesController.upload_resume);
router.post('/resumes/:_id', isLoggedIn, ResumesController.post_comment);

module.exports = router;
