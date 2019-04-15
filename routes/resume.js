var express  = require('express');

var router = express.Router();

// standard resume upload page and form
router.get('/resumes', (req, res) => {
    res.render('upload');
});

// route for uploading the file
router.post('/resumes/upload', upload.single("file"), (req, res) => {
    res.redirect("/")
});

// list of all currently stored resumes
router.get('/resumes/list', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    // Files exist
    return res.json(files);
  });
});

// view a specific pdf in the browser
router.get('/resumes/view/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // Check if pdf
    if (file.contentType === 'application/pdf') {
      // Read output to browser
        var data = gfs.createReadStream(file.filename);
        data.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not a PDF document'
      });
    }
  });
});

module.exports = router;
