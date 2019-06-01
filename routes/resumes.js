const Resume            = require("../models/resume"),
      passport          = require("passport"),
      express           = require("express"),
      multer            = require('multer'),
      path              = require('path'),
      fs                = require('fs'),
      router            = express.Router(),
      isLoggedIn        = require("../middleware/is_logged_in"),
      isUploader        = require("../middleware/is_uploader"),
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

// walkthrough page 1 - resume recommendation
router.get('/walkthrough/0', isLoggedIn, ResumesController.show_walkthrough_0);

// walkthrough page 2 - resume upload
router.get('/walkthrough/1', isLoggedIn, ResumesController.show_walkthrough_1);

// standard resume upload page and form
router.get('/resumes/upload', isLoggedIn, ResumesController.show_upload_page);

// list of all currently stored resumes
router.get('/resumes', isLoggedIn, ResumesController.show_resume_gallery);

// list of filtered currently stored resumes
router.get('/resumes/filtered/:tag', isLoggedIn, ResumesController.show_resume_gallery);

// view a specific pdf in the browser
router.get('/resumes/pdf/:filename', isLoggedIn, ResumesController.show_resume_pdf);

// view a specific resume
router.get('/resumes/:id', isLoggedIn, ResumesController.view_resume);

// edit a specific resume
router.get('/resumes/:id/edit', isLoggedIn, isUploader, ResumesController.show_edit_resume);

/*================================POST ROUTES=================================*/

// upload a resume (pdf file)
router.post('/resumes/upload', isLoggedIn, upload.single("file"), (req, res) => {
  if (req.fileValidationError) {
    ResumesController.show_upload_page(req, res);
  } else {
    req.file.filename = new Date().toISOString().replace(/:|\./g,'-') + '-' + req.file.originalname;
    ResumesController.upload_resume(req, res);
  }
});

// create a new comment
router.post('/resumes/:id/comments', isLoggedIn, ResumesController.post_comment);

// add a rating for a resume
router.post('/resumes/:id/rate', isLoggedIn, ResumesController.add_rating);

// submit a review request
router.post('/resumes/:id/request', isLoggedIn, isUploader, ResumesController.request_review);

/*================================UPDATE ROUTES===============================*/

// update an existing resume
router.put('/resumes/:id/edit', isLoggedIn, ResumesController.edit_resume);

/*================================DELETE ROUTES===============================*/

// delete a comment on a resume
router.delete('/resumes/:id/comments/:comment_id', isLoggedIn, ResumesController.delete_comment);

// delete an existing resume
router.delete('/resumes/:id', isLoggedIn, isUploader, ResumesController.delete_resume);

// delete a notification
router.delete('/notifications/:id', isLoggedIn, ResumesController.delete_notif);

/*============================================================================*/

module.exports = router;
