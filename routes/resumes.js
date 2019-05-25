const Resume            = require("../models/resume"),
      passport          = require("passport"),
      express           = require("express"),
      multer            = require('multer'),
      path              = require('path'),
      fs                = require('fs'),
      router            = express.Router(),
      isLoggedIn        = require("../middleware/is_logged_in"),
      ResumesController = require("../controllers/resumes"),
      sanitiser         = require('express-sanitizer');

// mount middleware for express santitiser
router.use(sanitiser());

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
    req.fileValidationError = "Forbidden extension";
    cb(null, false, req.fileValidationError);
  }
};

// initialise main multer constant
const upload = multer({
  storage: multer.MemoryStorage,
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

// view a specific resume
router.get('/resumes/:id', isLoggedIn, ResumesController.view_resume);

//
router.get('/resumes/:id/edit', isLoggedIn, ResumesController.edit_resume);

/*================================POST ROUTES=================================*/

// route for uploading the file
router.post('/resumes/upload', isLoggedIn, upload.single("file"), function(req, res) {
  if (req.fileValidationError) {
    ResumesController.show_upload_page(req, res);
  } else {
    req.file.filename = new Date().toISOString().replace(/:|\./g,'-') + '-' + req.file.originalname;
    ResumesController.upload_resume(req, res);
  }
});

router.post('/resumes/:id/comments', isLoggedIn, ResumesController.post_comment);

/*================================DELETE ROUTES===============================*/

router.delete('/resumes/:id/comments/:comment_id', isLoggedIn, ResumesController.delete_comment);

router.delete('/resumes/:id', isLoggedIn, ResumesController.delete_resume);

/*==================================PUT ROUTES=================================*/

router.put('/resumes/:id/edit', isLoggedIn, ResumesController.edit_resume_info);

module.exports = router;
